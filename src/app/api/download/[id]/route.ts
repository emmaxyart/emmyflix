import { NextResponse } from 'next/server';
import { StreamingService } from '@/services/streamingService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { type NextRequest } from 'next/server';
import { use } from 'react';

export const runtime = 'nodejs' // Mark as server-side only

export async function GET(
  request: NextRequest,
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
    // Validate movie ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Invalid movie ID'
      }, { status: 400 });
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Generate download URL
    const streamingService = StreamingService.getInstance();
    const downloadUrl = await streamingService.generateDownloadUrl(
      id,
      session.user.id
    );

    if (!downloadUrl) {
      return NextResponse.json({
        success: false,
        error: 'Failed to generate download URL'
      }, { status: 500 });
    }

    // Set cache control headers
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    return NextResponse.json({
      success: true,
      downloadUrl,
      message: 'Download URL generated successfully'
    }, {
      headers,
      status: 200
    });

  } catch (error: unknown) {
    console.error('Download error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate download URL';
    const errorStatus = error instanceof Error && 'status' in error ? 
      (error as { status: number }).status : 500;

    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: errorStatus });
  }
}







