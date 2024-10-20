import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';
import { parseStringPromise } from 'xml2js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');

  if (!videoUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const tracks = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!tracks || tracks.length === 0) {
      return NextResponse.json({ error: 'No subtitles found for this video' }, { status: 404 });
    }

    // Lấy URL của phụ đề đầu tiên
    const subtitleUrl = tracks[0].baseUrl;
    const subtitleResponse = await fetch(subtitleUrl);
    const subtitleXml = await subtitleResponse.text();

    // Sử dụng xml2js để phân tích cú pháp XML và lấy nội dung phụ đề
    const parsedXml = await parseStringPromise(subtitleXml);
    const textElements = parsedXml.transcript.text || [];
    const combinedText = textElements.map((item: any) => item._).join('\n');

    return NextResponse.json({ text: combinedText }, { status: 200 });
  } catch (error) {
    console.error('Failed to download subtitles:', error);
    return NextResponse.json({ error: 'Failed to download subtitles' }, { status: 500 });
  }
}
