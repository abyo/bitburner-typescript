export interface ServerPorts {
  required: number
  open: number
  ftp: boolean
  http: boolean
  smtp: boolean
  sql: boolean
  ssh: boolean
}

export interface ServerRam {
  used: number
  max: number
  free: number
}

export interface ServerSecurity {
  level: number
  base: number
  min: number
}

export interface ServerMoney {
  available: number
  max: number
  growth: number
}
