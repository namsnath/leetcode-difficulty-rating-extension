files = icons src manifest.json LICENSE

build:
	mkdir -p build
	zip -r build/leetcode-difficulty-rating.zip $(files)
.PHONY: build
