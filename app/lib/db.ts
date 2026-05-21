import { Pool, type PoolClient, type QueryResultRow } from "pg"

declare global {
  // Reuse the pool across Next.js hot reloads in development.
  // eslint-disable-next-line no-var
  var lexibornPgPool: Pool | undefined
}

export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL)

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured")
  }

  if (!globalThis.lexibornPgPool) {
    globalThis.lexibornPgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined
    })
  }

  return globalThis.lexibornPgPool
}

export async function dbQuery<T extends QueryResultRow = QueryResultRow>(sql: string, params: unknown[] = []) {
  return getPool().query<T>(sql, params)
}

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}
