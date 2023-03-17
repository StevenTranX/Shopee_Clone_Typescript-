import { AxiosError, isAxiosError } from 'axios'
import { describe, it, expect } from 'vitest'
// describe mô tả tập hợp ngữ cảnh hoặc đơn vị cần test : function, component
describe('isAxiosError', () => {
  // it ghi chú trường hợp cần test
  it('isAxiosError returns boolean', () => {
    // như tên của nó expect là giá trị chúng ta mong muốn trả về
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})

describe('isAxiosError', () => {
  it('isAxiosError returns boolean', () => {
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})
