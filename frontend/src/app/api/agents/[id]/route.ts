import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    success: true,
    data: {
      id: params.id,
      name: "Business Intelligence",
      description: "Revenue tracking and financial analytics",
      revenue: {
        current: 12500,
        total: 125000
      }
    }
  });
}