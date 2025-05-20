import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis';
import { prismaClient } from '@/lib/prisma';
// Remove direct AWS SDK import

// Initialize Redis for rate limiting
const redis = (() => {
  const url = process.env.UPSTASH_REDIS_URL;
  const token = process.env.UPSTASH_REDIS_TOKEN;

  if (!url || !url.startsWith('https://selected-hen-13529.upstash.io')) {
    throw new Error('Invalid UPSTASH_REDIS_URL. Must be a valid HTTPS URL');
  }

  if (!token) {
    throw new Error('UPSTASH_REDIS_TOKEN is not configured');
  }

  return new Redis({
    url,
    token,
  });
})();

// Configure rate limiters
const streamLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
});

interface StreamingOptions {
  quality?: '720p' | '1080p' | '4k';
  format?: 'hls' | 'dash';
}

export class StreamingService {
  private static instance: StreamingService;
  private constructor() {}

  static getInstance(): StreamingService {
    if (!this.instance) {
      this.instance = new StreamingService();
    }
    return this.instance;
  }

  private async loadAWS() {
    // Dynamic import AWS SDK only on server side
    if (typeof window === 'undefined') {
      const AWS = await import('aws-sdk');
      return AWS;
    }
    throw new Error('AWS SDK can only be used on the server side');
  }

  async generateStreamUrl(movieId: string, userId: string, options: StreamingOptions = {}) {
    try {
      // Check rate limiting
      const rateLimitKey = `stream:${userId}:${movieId}`;
      const requests = await redis.incr(rateLimitKey);
      await redis.expire(rateLimitKey, 3600); // Expire after 1 hour

      if (requests > 10) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Generate signed URL with your streaming provider
      const streamUrl = await this.getSignedStreamUrl(movieId, options);
      
      // Log streaming activity
      await this.logStreamingActivity(userId, movieId);

      return streamUrl;
    } catch (error) {
      console.error('Streaming error:', error);
      throw new Error('Failed to generate streaming URL');
    }
  }

  async generateDownloadUrl(movieId: string, userId: string) {
    try {
      // Check download permissions
      const canDownload = await this.checkDownloadPermissions(userId);
      if (!canDownload) {
        throw new Error('Download not permitted for this user');
      }

      // Generate temporary download URL
      const downloadUrl = await this.getSignedDownloadUrl(movieId);

      // Log download activity
      await this.logDownloadActivity(userId, movieId);

      return downloadUrl;
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  private async getSignedStreamUrl(movieId: string, options: StreamingOptions) {
    try {
      const AWS = await this.loadAWS();
      const cloudFront = new AWS.CloudFront.Signer(
        process.env.CLOUDFRONT_KEY_PAIR_ID!,
        process.env.CLOUDFRONT_PRIVATE_KEY!
      );

      const url = `https://${process.env.CLOUDFRONT_DOMAIN}/movies/${movieId}/manifest.m3u8`;
      const signedUrl = cloudFront.getSignedUrl({
        url,
        expires: Math.floor((Date.now() + 2 * 60 * 60 * 1000) / 1000), // 2 hours
      });

      return signedUrl;
    } catch (error) {
      console.error('Error generating signed stream URL:', error);
      throw new Error('Failed to generate streaming URL');
    }
  }

  private async getSignedDownloadUrl(movieId: string) {
    try {
      const AWS = await this.loadAWS();
      const s3 = new AWS.S3();

      const url = s3.getSignedUrl('getObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `movies/${movieId}/full.mp4`,
        Expires: 3600, // 1 hour
      });

      return url;
    } catch (error) {
      console.error('Error generating signed download URL:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  private async checkDownloadPermissions(userId: string) {
    try {
      // Check if user has an active subscription
      const userSubscription = await prismaClient.subscription.findFirst({
        where: { 
          userId,
          status: 'active',
          allowDownloads: true
        }
      });

      if (!userSubscription) {
        throw new Error('Your subscription does not include downloads');
      }

      // Check download limits
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      
      const downloadCount = await prismaClient.downloadActivity.count({
        where: {
          userId,
          timestamp: {
            gte: startOfDay
          }
        }
      });

      if (downloadCount >= 5) {  // Using a hardcoded default limit of 5
        throw new Error('Daily download limit reached');
      }

      return true;
    } catch (error) {
      console.error('Download permission check failed:', error);
      throw error;
    }
  }

  private async logStreamingActivity(userId: string, movieId: string) {
    await prismaClient.streamingActivity.create({
      data: {
        userId,
        movieId,
        timestamp: new Date(),
      }
    });
  }

  private async logDownloadActivity(userId: string, movieId: string) {
    await prismaClient.downloadActivity.create({
      data: {
        userId,
        movieId,
        timestamp: new Date(),
      }
    });
  }
}






















