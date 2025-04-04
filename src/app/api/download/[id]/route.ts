import { NextResponse } from 'next/server';
import { StreamingService } from '@/services/streamingService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Generate download URL
    const streamingService = StreamingService.getInstance();
    const downloadUrl = await streamingService.generateDownloadUrl(
      params.id,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      downloadUrl,
      message: 'Download URL generated successfully'
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate download URL'
    }, { status: error.status || 500 });
  }
}




