export enum HTTP_METHOD_ENUM {
  POST = 'post',
  GET = 'get',
  PATCH = 'patch',
  DELETE = 'delete',
}

/**
 * 1: 자유 게시판
 * 2: 공지 게시판
 * 3: 운영 게시판
 */
export enum POST_TYPE_ENUM {
  FREE = 1,
  NOTICE = 2,
  PROD = 3,
}
