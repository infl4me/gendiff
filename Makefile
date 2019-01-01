run:
	npx babel-node -- 'src/bin/gendiff.js' ~/projects/gendiff/__tests__/__fixtures__/before.json ~/projects/gendiff/__tests__/__fixtures__/after.json

install:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test

lint:
	npx eslint .

publish:
	npm publish

.PHONY: test
