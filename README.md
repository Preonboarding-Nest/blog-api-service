# 회원 등급에 따른 게시판 접근제어 및 이용 통계 서비스 

|👉 목차||
|---|---|
|[1. 요구사항 분석](#요구사항-분석)| 각 요구사항 분석|
|[2. API 명세서](#API-명세서)| swagger url|
|[3. 구현 과정](#구현-과정)| 기술스택, 모델링, 폴더 구조, 역할 분담|
|[4. 테스트](#테스트)| 각 서비스 unit test |
|[5. 서비스 배포](#서비스-배포)| service url|

회원 등급에 따라 접근할 수 있는 게시판을 제한하고, 사용자들의 이용 통계 정보를 이용할 수 있는 백엔드 서비스 입니다. 

회원 등급에 따라 게시판에 대한 접근 제어가 가능합니다.  
접근 제어의 예시는 다음과 같습니다.  

- 공지사항 게시판 
  - 관리자 등급의 회원은 공지사항 게시판에에 게시글을 생성, 조회, 수정, 삭제 할 수 있습니다. 
  - 일반 등급의 회원은 공지사항 게시판에서 게시글을 조회 할 수 있습니다. 
  
- 자유 게시판
  - 관리자 등급의 회원은 자유 게시판에 게시글을 생성, 조회, 수정, 삭제 할 수 있습니다.
  - 일반 등급의 회원은 자유 게시판에 게시글을 생성, 조회, 수정, 삭제 할 수 있습니다.
 
- 운영 게시판
  - 관리자 등급의 회원은 운영 게시판에 게시글을 생성, 조회, 수정, 삭제 할 수 있습니다. 
  - 일반 등급의 회원은 운영 게시판에 대해 아무런 작업을 할 수 없습니다. 

*각 회원은 자신이 작성한 게시글만 삭제, 수정 할 수 있습니다. 

# 요구사항 분석  
[요구사항 원문](https://github.com/Preonboarding-Nest/blog-api-service/files/9486215/default.pdf)

## 1. 회원 생성/조회/수정/삭제  
  
- 회원 정보는 `고객명`, `회원등급`, `성별`, `나이`, `연락처`, `가입일`, `마지막 접속일` 이다. 
- 회원 생성(회원 가입), 조회, 수정, 삭제(회원 탈퇴) 기능에 추가로 `로그인`, `로그아웃` 기능이 필요.

## 2. 게시글 생성/조회/수정/삭제 

- 각 게시판(공지사항, 자유게시판, 운영 게시판)에 소속되는 게시글을 생성, 조회, 수정, 삭제 한다. 

## 3. 회원 등급에 따른 게시판 기능 접근 제어 

- 회원의 등급에 따라 각 게시판에 대하여 수행할 수 있는 기능이 다르도록 한다.

  - 공지사항 게시판 
    - 관리자 등급의 회원은 공지사항 게시판에서 게시글을 생성, 조회, 수정, 삭제 할 수 있다.
    - 일반 등급의 회원은 공지사항 게시판에서 게시글을 조회 할 수 있다.

  - 자유 게시판
    - 관리자 등급의 회원은 자유 게시판에 게시글을 생성, 조회, 수정, 삭제 할 수 있다.
    - 일반 등급의 회원은 자유 게시판에 게시글을 생성, 조회, 수정, 삭제 할 수 있다.

  - 운영 게시판
    - 관리자 등급의 회원은 운영 게시판에 게시글을 생성, 조회, 수정, 삭제 할 수 있다. 
    - 일반 등급의 회원은 운영 게시판에 대해 아무런 작업을 할 수 없다.

## 4. 이용 통계 집계

통계 데이터는 다음의 유형을 제공한다.  

- 일정 시간내의
    - 남성 / 여성 회원 접속자 수
    - 나이대(10/20/30/40/50/60~)에 따른 접속자 수
    - 등급별 접속자 수
    - 일일 / 주간 / 월간 접속자 수
    - 회원가입 수
    - 회원탈퇴 수

# API 명세서

swagger를 사용하여 제작한 API Docs

[👉 Swagger Docs 바로가기](https://app.swaggerhub.com/apis-docs/preonboarding/blog-api-service/1.0)

# 구현 과정 

## 기술 스택 
- Framework: `NestJS`
- Database: `AWS RDS - postgres`
- ORM: `TypeORM`


## 환경 세팅

### 모델링

> 데이터베이스는 AWS LightSail로 생성했습니다.(RDS, PostgreSQL) 

![모델링](https://user-images.githubusercontent.com/63445753/188299953-62432aae-8f5d-4876-8b26-0169015c05cf.png) 

### 폴더 구조
```
project/
├─ src/
│  ├─ users/
│  ├─ posts/
│  ├─ auth/
│  ├─ statistics/
│  ├─ commons/
│  ├─ database/
│  ├─ filters/
│  ├─ interceptors/
│  ├─ redis/
├─ app.controller.ts
├─ app.module.ts
├─ app.service.ts
├─ main.ts
```

- users, posts, auth, statistics 폴더를 다누고, DTO 및 Entity를 작성하여 테이블 생성  
각 폴더에 module, controller, service, dto, entity 가 정의되어 있음  
각 module Emfdmf app.module에서 통합  
  
- commons : 모든 서비스에서 공용으로 사용하는 decorator, enum 등을 저장

- filters: 예외 필터 적용

- interceptors: response type 적용

- redis: cache memory 연결

## 역할 분담 🧑‍💻

| 이름 | 개발 파트 | 그 외|
|---|---|---|
| 김성진 | User API | User Service Unit Test |
| 박수정 | Auth API | 배포, Auth Service Unit Test |
| 송하림 | Statistics | Response Format 적용 |
| 인상운 | Post API | Post Service Unit Test |

# 테스트 

### 테스트 커버리지

#### Users service

- createUser
  - user 생성 여부 검증
  - email 중복시 BadRequestException 검증
- findUserById
  - user 조회 검증
  - 존재하지 않는 user 조회시 NotFoundException 검증
  - 삭제된 user 조회시 NotFoundException 검증
- removeUserById
  - user 삭제 검증 (= 삭제된 user 조회시 NotFoundException 검증)
  - 존재하지 않는 user 삭제시 NotFoundException 검증

#### Auth service
findUser
  - return user by email
  - return 404 error for finding user by email
  - return user by id
  - return 404 error for finding user by id

login
  - return tokens by email and id
  - return 401 error not making tokens
  - login success
  - return 404 error not existing user
  - return 404 error
 
logout
  - return true by id and logout
  - return 404 error not removing rt to redis

token
  - return accesstoken by id and refresh
  - return 404 error not getting rt to redis

#### Posts service
- 게시글 등록
  - 자유 게시판 게시글 등록 (유저: 성공, 관리자: 성공)
  - 공지 게시판 게시글 등록 (유저: 실패, 관리자: 성공)
  - 운영 게시판 게시글 등록 (유저: 실패, 관리자: 성공)
- 게시글 목록 조회
  - 자유 게시판 조회 (유저: 성공, 관리자: 성공)
  - 공지 게시판 조회 (유저: 성공, 관리자: 성공)
  - 운영 게시판 조회 (유저: 실패, 관리자: 성공)
- 게시글 상세 조회
  - 자유 게시판 조회 (유저: 성공, 관리자: 성공)
  - 공지 게시판 조회 (유저: 성공, 관리자: 성공)
  - 운영 게시판 조회 (유저: 실패, 관리자: 성공)

  
### 테스트 결과

#### Users service

![User service unit test result](https://user-images.githubusercontent.com/63445753/188340934-4e9e3569-4eb8-4f8b-a064-0ca4e8e91b38.png)

#### Auth Service

![image](https://user-images.githubusercontent.com/71163016/188348898-7a25c0a7-918c-4210-95c1-8abc6a9fcfd1.png)

#### Posts Service
![image](https://user-images.githubusercontent.com/81298415/188384988-66dbfd3c-f853-4dcd-85f2-7c0e894c2908.png)


# 서비스 배포 

> GCP Compute Engine에 docker compose를 사용해 배포하였습니다.

👉 http://34.64.203.1:4000/
