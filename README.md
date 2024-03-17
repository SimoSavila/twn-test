## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Requirements
- docker
- [nvm](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)
- [PNPM](https://pnpm.io/installation)
## Installation

1. start docker and mongo db instances for development and testing
```bash
$ docker compose up -d
```
2. After that install dependencies using PNPM
```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

After running any of these commands swagger can be found http://localhost:3000/documentation
and YAML http://localhost:3000/documentation-yaml

To seed development Database run command:
```bash
$ pnpm db:seed
```

## Test

```bash
# e2e tests
$ pnpm run test:e2e
```
