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

/**
 * 정리
 * 년 월 일 시 분 초
 *
 * loading 이슈로 초 단위는 주석처리
 */
export enum TERM_ENUM {
  MONTH = 'month',
  DATE = 'date',
  HOUR = 'hour',
  MIN = 'min',
  // SEC = 'sec',
}
