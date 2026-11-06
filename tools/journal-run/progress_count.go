package main

import (
	"bufio"
	"os"
	"regexp"
	"strconv"
)

func hasProgressCount(path, pattern string) bool {
	if pattern == "" {
		return false
	}
	expression, err := regexp.Compile(pattern)
	if err != nil {
		return false
	}
	file, err := os.Open(path)
	if err != nil {
		return false
	}
	defer file.Close()
	colour := regexp.MustCompile(`\x1b\[[0-9;]*m`)
	scanner := bufio.NewScanner(file)
	scanner.Buffer(make([]byte, 4096), 1024*1024)
	for scanner.Scan() {
		match := expression.FindStringSubmatch(colour.ReplaceAllString(scanner.Text(), ""))
		if len(match) == 0 {
			continue
		}
		if len(match) == 1 {
			return true
		}
		for _, group := range match[1:] {
			if number, err := strconv.Atoi(group); err == nil && number > 0 {
				return true
			}
		}
	}
	return false
}
