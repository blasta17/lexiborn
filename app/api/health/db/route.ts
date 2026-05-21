import { NextResponse } from "next/server"
import { dbQuery, hasDatabaseUrl } from "../../../lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  if (!hasDatabaseUrl) {
    return NextResponse.json({ ok: false, database: "not_configured" }, { status: 503 })
  }

  try {
    const result = await dbQuery<{ now: string }>("SELECT now()::text")
    return NextResponse.json({ ok: true, database: "connected", now: result.rows[0]?.now })
  } catch (error) {
    return NextResponse.json({ ok: false, database: "error", message: error instanceof Error ? error.message : "unknown" }, { status: 503 })
  }
}
