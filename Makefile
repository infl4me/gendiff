run:
	npx babel-node -- 'src/bin/hexlet.js' 

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
