export interface IRequest {
    url: string
    method: 'GET'| 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    headers?: {
        [key: string]: any
    }
    body?:{
        [key: string]: any
    }
    maxRequests: number
    concurrency: number
    timeout: number
}
