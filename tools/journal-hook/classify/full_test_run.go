package classify

import (
	"path/filepath"
	"regexp"
	"slices"
	"strings"
)

const testRunCategory = "test run"

// The flags that pick some tests out of a suite, so a run with one of them is no full run.
var selectingFlags = []string{"-k", "-t", "-run", "--filter", "--testNamePattern", "--lf", "--last-failed", "--testPathPattern", "--grep"}

// The flags whose next word is their value and names no test.
var testValueFlags = []string{"-n", "-p", "-c", "-o", "-m", "--prefix", "--root", "--tb", "--maxfail", "--workers", "--timeout", "-timeout", "-C"}

// The words of a test command that name its program and no tests.
var testProgramWords = []string{"python", "python3", "pytest", "unittest", "npm", "npx", "pnpm", "yarn", "vitest", "jest", "go", "test", "run", "tests", "tests/", "test/", "spec", "./..."}

var number = regexp.MustCompile(`^[0-9]+$`)

// IsFullTestRun says a part runs a whole test suite: a test run that names no file, deeper folder or test.
func (classifier *Classifier) IsFullTestRun(text string, classification Classification) bool {
	if classification.Category != testRunCategory {
		return false
	}
	tokens := classifier.tokens(text)
	if len(tokens) == 0 {
		return false
	}
	for position := 1; position < len(tokens); position++ {
		token := tokens[position]
		name := strings.SplitN(token, "=", 2)[0]
		if slices.Contains(selectingFlags, name) {
			return false
		}
		if slices.Contains(testValueFlags, token) {
			position++
			continue
		}
		if strings.HasPrefix(token, "-") || number.MatchString(token) || slices.Contains(testProgramWords, token) {
			continue
		}
		return false
	}
	return filepath.Ext(tokens[0]) == "" || slices.Contains(testProgramWords, baseName(tokens[0]))
}
