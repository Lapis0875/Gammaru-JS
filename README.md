# 겜마루 JS 스터디 1주차 과제

1. Markdown (마크다운) 문법에 대해 알아보고, Markdown 문법을 사용한 간단한 글을 자유롭게 작성하신 뒤 관련 라이브러리를 활용해 html 파일로 보여주세요.
2. express (익스프레스) 라이브러리에 대해 알아보고, html 파일을 보여주는 서버를 실행시켜주세요.

## 실행

```sh
node index.js
```

## 프로젝트 구조

`contents/` : 마크다운 문법으로 작성한 글을 저장하는 경로입니다.

`templates/` : 전체 html의 일부를 변수로 비워둔 템플릿들을 저장하는 경로입니다.

`deploy/` : `contents/` 문법에 저장된 마크다운 파일들을 html로 렌더링한 후, 템플릿의 변수에 채워 전체 html을 생성해 저장합니다.

`route/` : express 서버의 라우터를 작성하는 경로입니다.

`index.js` : 실행할 파일입니다.

`markdown.js` : 마크다운 렌더링 과정을 별도의 모듈로 분리했습니다.

`models/todo.js` : Todo 모델을 작성했습니다.

`data/todos.json` : Todo 데이터를 저장합니다.

`todo_api.js` : Todo REST API를 구현합니다.

## Todo REST API (2주차 과제)

```raml
#%RAML 1.0
---
title: Todo REST API
baseUri: http://localhost:3000/
version: v1

/todo:
    get:
        description: Retrieve a list of unfinished todos.
        responses:
        200:
          body:
            application/json:
              example: |
                [
                    {
                        "id": 0,
                        "name": "JS 2주차 과제하기",
                        "due": "2022-05-22",
                        "finished": false
                    },
                    {
                        "id": 1,
                        "name": "유니티 2주차 과제하기",
                        "due": "2022-05-23",
                        "finished": false
                    },
                    {
                        "id": 2,
                        "name": "물리 실험보고서 쓰기",
                        "due": "2022-05-26",
                        "finished": false
                    }
                ]

    /get/{id}:
        get:
            description: Get existing todo of id = {id}.
            responses:
            200:
                body:
                    application/json:
                        example: |
                        {
                            "id": 2,
                            "name": "물리 실험보고서 쓰기",
                            "due": "2022-05-26",
                            "finished": false
                        }  
    /create:
        post:
            description: Create new todo.
            queryParameters:
                name:
                    displayName: name
                    type: string
                    description: Todo의 이름입니다.
                    example: JS 스터디 2주차 과제하기
                    required: true
                due:
                    displayName: due
                    type: string
                    description: Todo의 기한입니다.
                    example: 2022-05-20
                    required: true
                finished:
                    displayName: finished
                    type: boolean
                    description: Todo의 완료 여부입니다.
                    example: false
                    required: false
            responses:
            200:
                body:
                    application/json:
                        example: |
                        {
                            "id": 2,
                            "name": "물리 실험보고서 쓰기",
                            "due": "2022-05-26",
                            "finished": false
                        }  
    /edit/{id}:
        put:
            description: Edit existing todo of id = {id}.
            queryParameters:
                name:
                    displayName: name
                    type: string
                    description: Todo의 이름입니다.
                    example: JS 스터디 2주차 과제하기
                    required: false
                due:
                    displayName: due
                    type: string
                    description: Todo의 기한입니다.
                    example: 2022-05-20
                    required: false
                finished:
                    displayName: finished
                    type: boolean
                    description: Todo의 완료 여부입니다.
                    example: false
                    required: false
            responses:
            200:
                body:
                    application/json:
                        example: |
                        {
                            "id": 0,
                            "name": "JS 2주차 과제하기",
                            "due": "2022-05-31T15:00:00.000Z",
                            "finished": false
                        }  
    /delete/{id}:
        delete:
            description: Delete existing todo of id = {id}.

```

## 소감

JS 문법을 아직 잘 모르는 단계에서 갑작스럽게 주어진 과제라 좀 놀랐지만, 화살표 함수같이 스쳐지나가며 봐두었던 문법들을 제대로 활용해볼 수 있어 좋았습니다. 이전에 Jekyll, Hexo 등의 정적 블로그들을 사용해봤는데, 마크다운 렌더링 등을 사용해 나만의 블로그를 만들어보는것도 재밌겠다는 생각이 들었습니다 :D
