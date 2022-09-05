# 회원 등급에 따른 게시판 접근제어 및 이용 통계 서비스 
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
[요구사항 원문](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/94522ad0-8ea2-4f4e-80d5-84b48863fb9e/백엔드_웨인힐스브라이언트에이아이.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220903%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220903T115346Z&X-Amz-Expires=86400&X-Amz-Signature=1761fa006bbedd291763a150a9e42ca0aa7e720c5555a8a74ce4608ebda7c74f&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%255B%25E1%2584%2587%25E1%2585%25A2%25E1%2586%25A8%25E1%2584%258B%25E1%2585%25A6%25E1%2586%25AB%25E1%2584%2583%25E1%2585%25B3%255D%2520%25E1%2584%258B%25E1%2585%25B0%25E1%2584%258B%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2592%25E1%2585%25B5%25E1%2586%25AF%25E1%2584%2589%25E1%2585%25B3%25E1%2584%2587%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25A1%25E1%2584%258B%25E1%2585%25B5%25E1%2584%258B%25E1%2585%25A5%25E1%2586%25AB%25E1%2584%2590%25E1%2585%25B3%25E1%2584%258B%25E1%2585%25A6%25E1%2584%258B%25E1%2585%25B5%25E1%2584%258B%25E1%2585%25A1%25E1%2584%258B%25E1%2585%25B5.pdf%22&x-id=GetObject)

## 1. 회원 생성/조회/수정/삭제  
  
- 회원 정보는 `고객명`, `회원등급`, `성별`, `나이`, `연락처`, `가입일`, `마지막 접속일` 이다. 
- 회원 생성(회원 가입), 조회, 수정, 삭제(회원 탈퇴) 기능에 추가로 `로그인`, `로그아웃` 기능이 필요.

## 2. 게시글 생성/조회/수정/삭제 

- 각 게시판(공지사항, 자유게시판, 운영 게시판)에 소속되는 게시글을 생성, 조회, 수정, 삭제 한다. 

## 3. 회원 등급에 따른 게시판 기능 접근 제어 

- 회원의 등급에 따라 각 게시판에 대하여 수행할 수 있는 기능이 다르도록 한다.

  - 공지사항 게시판 
    - 관리자 등급의 회원은 공지사항 게시판에에 게시글을 생성, 조회, 수정, 삭제 할 수 있다.
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
    


# 사용 예제  (api doc ?)
## 1. 회원 
### 1.1 회원 등록(POST)

### 1.2 회원 조회(GET)

### 1.3 회원 삭제(DELETE)

### 1.5 로그인(POST)

### 1.6 로그아웃(POST)

### 1.7 Token refresh()


## 2. 게시판 / 게시글 
### 2.1 게시판 등록(POST)

### 2.2 게시판 목록 조회(GET)

### 2.3 게시판 수정(PATCH)

### 2.4 게시판 삭제(DELETE)

### 2.5 게시글 ~ 


## 통계



# 구현 과정 

## 기술 스택 
- Framework: NestJS
- Database: AWS RDS - postgres
- ORM: TypeORM 


## 환경 세팅

데이터베이스 생성(AWS RDS): PostgredSQL

데이터베이스 연결 및 모델링

![모델링](https://user-images.githubusercontent.com/63445753/188299953-62432aae-8f5d-4876-8b26-0169015c05cf.png) 


모델링 주요 이슈 
1.
2.
3.

폴더 구조
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

users, posts, auth, statistics 폴더를 다누고, DTO 및 Entity를 작성하여 테이블 생성  
각 폴더에 module, controller, service, dto, entity 가 정의되어 있음  
각 module Emfdmf app.module에서 통합  
  
commons :  
database:  
filters:  
interceptors:  
redis:  



## API 구현 
### controller 구현

### service 구현

### gurad 구현

### interceptor 구현

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
...

  
### 테스트 결과

#### Users service

![User service unit test result](https://user-images.githubusercontent.com/63445753/188340934-4e9e3569-4eb8-4f8b-a064-0ca4e8e91b38.png)

#### Auth Service

# 서비스 배포  
## 배포 환경 
// 환경 설명

## 서비스 캡쳐 사진 
// 이미지 

