export type AircraftShape =
  | "widebody"
  | "narrowbody"
  | "regional"
  | "cargo"
  | "helicopter"
  | "military"
  | "light"
  | "default";

export interface AircraftTypeInfo {
  readonly label: string;
  readonly color: string;
  readonly shape: AircraftShape;
}

const AIRCRAFT_TYPE_MAP: Record<string, AircraftTypeInfo> = {
  // Widebody
  B744: { label: "Boeing 747-400", color: "#3498db", shape: "widebody" },
  B748: { label: "Boeing 747-8", color: "#3498db", shape: "widebody" },
  B772: { label: "Boeing 777-200", color: "#3498db", shape: "widebody" },
  B773: { label: "Boeing 777-300", color: "#3498db", shape: "widebody" },
  B77L: { label: "Boeing 777-200LR", color: "#3498db", shape: "widebody" },
  B77W: { label: "Boeing 777-300ER", color: "#3498db", shape: "widebody" },
  B788: { label: "Boeing 787-8", color: "#3498db", shape: "widebody" },
  B789: { label: "Boeing 787-9", color: "#3498db", shape: "widebody" },
  B78X: { label: "Boeing 787-10", color: "#3498db", shape: "widebody" },
  A332: { label: "Airbus A330-200", color: "#3498db", shape: "widebody" },
  A333: { label: "Airbus A330-300", color: "#3498db", shape: "widebody" },
  A339: { label: "Airbus A330-900neo", color: "#3498db", shape: "widebody" },
  A340: { label: "Airbus A340", color: "#3498db", shape: "widebody" },
  A342: { label: "Airbus A340-200", color: "#3498db", shape: "widebody" },
  A343: { label: "Airbus A340-300", color: "#3498db", shape: "widebody" },
  A345: { label: "Airbus A340-500", color: "#3498db", shape: "widebody" },
  A346: { label: "Airbus A340-600", color: "#3498db", shape: "widebody" },
  A359: { label: "Airbus A350-900", color: "#3498db", shape: "widebody" },
  A35K: { label: "Airbus A350-1000", color: "#3498db", shape: "widebody" },
  A380: { label: "Airbus A380", color: "#3498db", shape: "widebody" },

  // Narrowbody
  B737: { label: "Boeing 737", color: "#2ecc71", shape: "narrowbody" },
  B738: { label: "Boeing 737-800", color: "#2ecc71", shape: "narrowbody" },
  B739: { label: "Boeing 737-900", color: "#2ecc71", shape: "narrowbody" },
  B38M: { label: "Boeing 737 MAX 8", color: "#2ecc71", shape: "narrowbody" },
  B39M: { label: "Boeing 737 MAX 9", color: "#2ecc71", shape: "narrowbody" },
  B3XM: { label: "Boeing 737 MAX 10", color: "#2ecc71", shape: "narrowbody" },
  A319: { label: "Airbus A319", color: "#2ecc71", shape: "narrowbody" },
  A320: { label: "Airbus A320", color: "#2ecc71", shape: "narrowbody" },
  A19N: { label: "Airbus A319neo", color: "#2ecc71", shape: "narrowbody" },
  A20N: { label: "Airbus A320neo", color: "#2ecc71", shape: "narrowbody" },
  A321: { label: "Airbus A321", color: "#2ecc71", shape: "narrowbody" },
  A21N: { label: "Airbus A321neo", color: "#2ecc71", shape: "narrowbody" },
  E190: { label: "Embraer E190", color: "#2ecc71", shape: "narrowbody" },
  E195: { label: "Embraer E195", color: "#2ecc71", shape: "narrowbody" },
  E290: { label: "Embraer E190-E2", color: "#2ecc71", shape: "narrowbody" },
  E295: { label: "Embraer E195-E2", color: "#2ecc71", shape: "narrowbody" },
  B752: { label: "Boeing 757-200", color: "#2ecc71", shape: "narrowbody" },
  B753: { label: "Boeing 757-300", color: "#2ecc71", shape: "narrowbody" },

  // Regional
  CRJ2: { label: "Bombardier CRJ-200", color: "#f39c12", shape: "regional" },
  CRJ7: { label: "Bombardier CRJ-700", color: "#f39c12", shape: "regional" },
  CRJ9: { label: "Bombardier CRJ-900", color: "#f39c12", shape: "regional" },
  CRJX: { label: "Bombardier CRJ-1000", color: "#f39c12", shape: "regional" },
  E135: { label: "Embraer ERJ-135", color: "#f39c12", shape: "regional" },
  E145: { label: "Embraer ERJ-145", color: "#f39c12", shape: "regional" },
  E170: { label: "Embraer E170", color: "#f39c12", shape: "regional" },
  E175: { label: "Embraer E175", color: "#f39c12", shape: "regional" },
  E75L: { label: "Embraer E175 Long Range", color: "#f39c12", shape: "regional" },
  AT43: { label: "ATR 42-300", color: "#f39c12", shape: "regional" },
  AT72: { label: "ATR 72", color: "#f39c12", shape: "regional" },
  AT76: { label: "ATR 72-600", color: "#f39c12", shape: "regional" },
  DH8D: { label: "Dash 8 Q400", color: "#f39c12", shape: "regional" },
  DH8C: { label: "Dash 8-300", color: "#f39c12", shape: "regional" },
  DH8A: { label: "Dash 8-100", color: "#f39c12", shape: "regional" },
  SB20: { label: "Saab 2000", color: "#f39c12", shape: "regional" },

  // Cargo / military transport
  C17: { label: "C-17 Globemaster", color: "#e67e22", shape: "cargo" },
  C130: { label: "C-130 Hercules", color: "#e67e22", shape: "cargo" },
  C30J: { label: "C-130J Super Hercules", color: "#e67e22", shape: "cargo" },
  A400: { label: "Airbus A400M", color: "#e67e22", shape: "cargo" },
  IL76: { label: "Ilyushin IL-76", color: "#e67e22", shape: "cargo" },
  AN12: { label: "Antonov An-12", color: "#e67e22", shape: "cargo" },
  AN26: { label: "Antonov An-26", color: "#e67e22", shape: "cargo" },
  A124: { label: "Antonov An-124", color: "#e67e22", shape: "cargo" },

  // Helicopter
  H135: { label: "Airbus H135", color: "#9b59b6", shape: "helicopter" },
  H145: { label: "Airbus H145", color: "#9b59b6", shape: "helicopter" },
  H160: { label: "Airbus H160", color: "#9b59b6", shape: "helicopter" },
  H175: { label: "Airbus H175", color: "#9b59b6", shape: "helicopter" },
  H215: { label: "Airbus H215", color: "#9b59b6", shape: "helicopter" },
  EC35: { label: "Eurocopter EC135", color: "#9b59b6", shape: "helicopter" },
  EC45: { label: "Eurocopter EC145", color: "#9b59b6", shape: "helicopter" },
  EC75: { label: "Eurocopter EC175", color: "#9b59b6", shape: "helicopter" },
  AS50: { label: "Eurocopter AS350", color: "#9b59b6", shape: "helicopter" },
  AS32: { label: "Eurocopter AS332", color: "#9b59b6", shape: "helicopter" },
  B06: { label: "Bell 206", color: "#9b59b6", shape: "helicopter" },
  B407: { label: "Bell 407", color: "#9b59b6", shape: "helicopter" },
  B429: { label: "Bell 429", color: "#9b59b6", shape: "helicopter" },
  R22: { label: "Robinson R22", color: "#9b59b6", shape: "helicopter" },
  R44: { label: "Robinson R44", color: "#9b59b6", shape: "helicopter" },
  R66: { label: "Robinson R66", color: "#9b59b6", shape: "helicopter" },
  S76: { label: "Sikorsky S-76", color: "#9b59b6", shape: "helicopter" },
  S92: { label: "Sikorsky S-92", color: "#9b59b6", shape: "helicopter" },
  A109: { label: "AgustaWestland AW109", color: "#9b59b6", shape: "helicopter" },
  A139: { label: "AgustaWestland AW139", color: "#9b59b6", shape: "helicopter" },
  A189: { label: "AgustaWestland AW189", color: "#9b59b6", shape: "helicopter" },

  // Military
  F16: { label: "F-16 Fighting Falcon", color: "#7f8c8d", shape: "military" },
  F18: { label: "F/A-18 Hornet", color: "#7f8c8d", shape: "military" },
  F15: { label: "F-15 Eagle", color: "#7f8c8d", shape: "military" },
  F35: { label: "F-35 Lightning II", color: "#7f8c8d", shape: "military" },
  F22: { label: "F-22 Raptor", color: "#7f8c8d", shape: "military" },
  EUFI: { label: "Eurofighter Typhoon", color: "#7f8c8d", shape: "military" },
  RFAL: { label: "Dassault Rafale", color: "#7f8c8d", shape: "military" },
  TORD: { label: "Panavia Tornado", color: "#7f8c8d", shape: "military" },
  E3CF: { label: "E-3 Sentry AWACS", color: "#7f8c8d", shape: "military" },
  KC35: { label: "KC-135 Stratotanker", color: "#7f8c8d", shape: "military" },
  KC10: { label: "KC-10 Extender", color: "#7f8c8d", shape: "military" },
  B52: { label: "B-52 Stratofortress", color: "#7f8c8d", shape: "military" },

  // Light / General Aviation
  C172: { label: "Cessna 172", color: "#1abc9c", shape: "light" },
  C182: { label: "Cessna 182", color: "#1abc9c", shape: "light" },
  C206: { label: "Cessna 206", color: "#1abc9c", shape: "light" },
  C208: { label: "Cessna 208 Caravan", color: "#1abc9c", shape: "light" },
  C210: { label: "Cessna 210", color: "#1abc9c", shape: "light" },
  C310: { label: "Cessna 310", color: "#1abc9c", shape: "light" },
  C402: { label: "Cessna 402", color: "#1abc9c", shape: "light" },
  C510: { label: "Cessna Citation Mustang", color: "#1abc9c", shape: "light" },
  PA28: { label: "Piper PA-28", color: "#1abc9c", shape: "light" },
  PA32: { label: "Piper PA-32", color: "#1abc9c", shape: "light" },
  PA34: { label: "Piper PA-34 Seneca", color: "#1abc9c", shape: "light" },
  PA46: { label: "Piper PA-46 Malibu", color: "#1abc9c", shape: "light" },
  P28A: { label: "Piper PA-28 Cherokee", color: "#1abc9c", shape: "light" },
  SR20: { label: "Cirrus SR20", color: "#1abc9c", shape: "light" },
  SR22: { label: "Cirrus SR22", color: "#1abc9c", shape: "light" },
  SF50: { label: "Cirrus SF50 Vision Jet", color: "#1abc9c", shape: "light" },
  BE35: { label: "Beechcraft Bonanza", color: "#1abc9c", shape: "light" },
  BE36: { label: "Beechcraft Bonanza 36", color: "#1abc9c", shape: "light" },
  BE58: { label: "Beechcraft Baron 58", color: "#1abc9c", shape: "light" },
  DA40: { label: "Diamond DA40", color: "#1abc9c", shape: "light" },
  DA42: { label: "Diamond DA42", color: "#1abc9c", shape: "light" },
  DA62: { label: "Diamond DA62", color: "#1abc9c", shape: "light" },
  PC12: { label: "Pilatus PC-12", color: "#1abc9c", shape: "light" },
  PC24: { label: "Pilatus PC-24", color: "#1abc9c", shape: "light" },
  TBM9: { label: "Daher TBM 900", color: "#1abc9c", shape: "light" },
};

const DEFAULT_INFO: AircraftTypeInfo = {
  label: "Unknown",
  color: "#95a5a6",
  shape: "default",
};

export function getAircraftTypeInfo(code: string): AircraftTypeInfo {
  return AIRCRAFT_TYPE_MAP[code] ?? DEFAULT_INFO;
}
