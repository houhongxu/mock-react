export type Flags = number

// 0
export const NoFlags = /*                      */ 0b00000000000000000000000000

// 2
export const Placement = /*                    */ 0b00000000000000000000000010

// 4
export const Update = /*                       */ 0b00000000000000000000000100

// 6
export const PlacementAndUpdate = /*           */ Placement | Update

// 8
export const Deletion = /*                     */ 0b00000000000000000000001000
