export type WorkTag =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25

// 函数组件
export const FunctionComponent = 0

// 类组件
export const ClassComponent = 1

// 未知
export const IndeterminateComponent = 2

// host root fiber
export const HostRoot = 3

// div
export const HostComponent = 5

// <div>123</div>的123
export const HostText = 6

// <></>
export const Fragment = 7
