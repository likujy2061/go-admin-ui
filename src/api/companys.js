import request from '@/utils/request'

// 查询Companys列表
export function listCompanys(query) {
  return request({
    url: '/api/v1/companysList',
    method: 'get',
    params: query
  })
}

// 查询Companys字典
export function DictCompanys() {
  return request({
    url: '/api/v1/companysdict',
    method: 'get'
  })
}


// 查询Companys详细
export function getCompanys(id) {
  return request({
    url: '/api/v1/companys/' + id,
    method: 'get'
  })
}


// 新增Companys
export function addCompanys(data) {
  return request({
    url: '/api/v1/companys',
    method: 'post',
    data: data
  })
}

// 修改Companys
export function updateCompanys(data) {
  return request({
    url: '/api/v1/companys',
    method: 'put',
    data: data
  })
}

// 删除Companys
export function delCompanys(id) {
  return request({
    url: '/api/v1/companys/' + id,
    method: 'delete'
  })
}
