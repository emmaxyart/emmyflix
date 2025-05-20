import { NextResponse } from 'next/server';
import { StreamingService } from '@/services/streamingService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { use } from 'react';

export const runtime = 'nodejs' // Mark as server-side only

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = use(params);

  // Ensure we're on the server
  if (typeof window !== 'undefined') {
    return NextResponse.json({ 
      success: false, 
      error: 'This API route must be called from the server' 
    }, { status: 400 });
  }

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get streaming options from query params
    const { searchParams } = new URL(request.url);
    const quality = searchParams.get('quality') as '720p' | '1080p' | '4k';
    const format = searchParams.get('format') as 'hls' | 'dash';

    // Generate streaming URL
    const streamingService = StreamingService.getInstance();
    const streamUrl = await streamingService.generateStreamUrl(
      id,
      session.user.id,
      { quality, format }
    );

    return NextResponse.json({
      success: true,
      streamUrl,
      message: 'Stream URL generated successfully'
    });
  } catch (error: any) {
    console.error('Streaming error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate stream URL'
    }, { status: error.status || 500 });
  }
}








