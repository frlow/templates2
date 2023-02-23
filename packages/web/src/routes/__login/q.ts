const tokens: Record<string, Date> = {}

export const generateToken = (): string => {
  return 'sometoken'
}

export function GET() {
  return new Response(null, { status: 200 })
}
