import request from '@/utils/request'

// 查询Invoicerecord列表
export function listInvoicerecord(query) {
  return request({
    url: '/api/v1/invoicerecordList',
    method: 'get',
    params: query
  })
}

// 查询Invoicerecord详细
export function getInvoicerecord(id) {
  return request({
    url: '/api/v1/invoicerecord/' + id,
    method: 'get'
  })
}


// 新增Invoicerecord
export function addInvoicerecord(data) {
  return request({
    url: '/api/v1/invoicerecord',
    method: 'post',
    data: data
  })
}

// 修改Invoicerecord
export function updateInvoicerecord(data) {
  return request({
    url: '/api/v1/invoicerecord',
    method: 'put',
    data: data
  })
}

// 删除Invoicerecord
export function delInvoicerecord(id) {
  return request({
    url: '/api/v1/invoicerecord/' + id,
    method: 'delete'
  })
}
