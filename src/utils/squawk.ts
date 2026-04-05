const SQUAWK_MAP: Record<string, string> = {
  "7500": "Hijack",
  "7600": "Radio Failure",
  "7700": "Emergency",
};

export function getSquawkLabel(code: string): string {
  if (code === "") return "N/A";
  return SQUAWK_MAP[code] ?? code;
}
