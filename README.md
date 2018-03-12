# Typescript Boilerplate

[Typescript](https://www.typescriptlang.org)를 개발 언어로 사용하여 `Node.js` 환경에서 실행되는 app이나 module을 개발하기 위한 `Boilerplate`이다. `Development` 환경에서의 컴파일러는 `tsc`를 사용하며 `production` 환경에서 컴파일러는 [Parcel](https://parceljs.org)을 사용한다. `Test`는 [AVA](https://github.com/avajs/ava)를 사용한다.


## File Structure

- **bin:** build를 위해, 또는 다른 작업을 위해 사용할 util 실행 파일들
- **src:** 개발 코드들과 자원들
- **dist:** src/를 빌드하고 빌드물을 여기에 저장
- **test:** 테스트 코드들
- **test.dist:** test/를 빌드하고 빌드물을 여기에 저장
- **util:** util 코드들 & 빌드물


## Usage

### tsc로 build & start

tsc로 .d.ts와 디버그 맵 정보를 포함해 컴파일 한다. 디버깅이 가능한 development 버젼이다.

```bash
yarn clean  # 만약 release하거나 build.parcel하면 같이 공유하는 dist 디렉토리가 오염되므로 먼저 clean 하는게 좋다.
yarn build && yarn start
```


### Parcel로 build & start

`parcel`로 bundle하여 실행한다. `production` 버젼이다. `docker`안이나 `server platform`에서 사용될 것이다. 그러나 만약 `npm`으로 publish하거나 다른 프로젝트에 module로 사용할 것 이라면 parcel build보다는 tsc build가 더 좋다.

```bash
yarn clean
yarn build.parcel && yarn start
```

필요하면 production 으로 환경 설정하자.


### Release

`parcel`로 bundle하고 `.tar.gz`로 압축해 지정한 곳으로 release 한다. 어디로 release할 지는 `utils/index.ts`에 `release()` 함수를 수정함으로 변경 가능하다.

```bash
yarn release
```


### Test

테스트는 `ava`를 사용한다. 물론 cli로 옵션을 적용할 수 있지만, `package.json`에서 `ava` 섹션에서도 가능하다.

```bash
yarn test
```


### 부분 Test

`--match` 옵션으로 match되는 title만 테스트할 수 있다.

```bash
yarn test --match='*foo'
# foo로 시작하는 title를 가진 테스트만 테스트
```


## License

Copyright (c) bynaki. All rights reserved.

Licensed under the MIT License.