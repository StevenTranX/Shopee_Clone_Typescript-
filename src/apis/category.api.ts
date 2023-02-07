import { Category } from 'src/types/category.type'
import http from 'src/utils/http'
import { SuccessResponse } from './../types/utils.type'

const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponse<Category[]>>(URL)
  }
}
export default categoryApi
