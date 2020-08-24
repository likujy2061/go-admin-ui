import request from '@/utils/request'

// 查询Orderpaymenttypes列表
export function listOrderpaymenttypes(query) {
  return request({
    url: '/api/v1/orderpaymenttypesList',
    method: 'get',
    params: query
  })
}

// 查询Orderpaymenttypes详细
export function getOrderpaymenttypes(id) {
  return request({
    url: '/api/v1/orderpaymenttypes/' + id,
    method: 'get'
  })
}


// 新增Orderpaymenttypes
export function addOrderpaymenttypes(data) {
  return request({
    url: '/api/v1/orderpaymenttypes',
    method: 'post',
    data: data
  })
}

// 修改Orderpaymenttypes
export function updateOrderpaymenttypes(data) {
  return request({
    url: '/api/v1/orderpaymenttypes',
    method: 'put',
    data: data
  })
}

// 删除Orderpaymenttypes
export function delOrderpaymenttypes(id) {
  return request({
    url: '/api/v1/orderpaymenttypes/' + id,
    method: 'delete'
  })
}
