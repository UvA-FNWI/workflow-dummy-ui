import {type ReactNode} from "react";

export interface Column<T> {
  key: string
  value?: (t: T) => string | number | undefined | null
  render?: (t: T) => ReactNode
  sorter?: (s: T, t: T) => number
  filter?: boolean
  header?: ReactNode
  width?: string
  hide?: boolean
}