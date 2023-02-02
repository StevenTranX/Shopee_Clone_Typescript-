export const sortBy = {
  createAt: 'createAt',
  view: 'view',
  sold: 'sold',
  price: 'price'
} as const

// trick : ép sortBy là dạng read-only, không thay đổi được giá trị

export const order = {
  asc: 'asc',
  desc: 'desc'
} as const
