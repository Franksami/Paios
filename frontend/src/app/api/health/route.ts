import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    mode: 'mock',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}