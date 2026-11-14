package classify

import "testing"

func TestAFullTestRunIsARunThatNamesNoTests(t *testing.T) {
	classifier := NewClassifier(LoadTable(""))
	for text, want := range map[string]bool{
		"pytest":          true,
		"pytest tests -q": true,
		"python3 -m pytest tests -q -n 4 --tb=line -p no:cacheprovider": true,
		"go test ./...":                 true,
		"npm test":                      true,
		"pytest tests/stories/cart.py":  false,
		"pytest tests/stories":          false,
		"pytest tests -k cart":          false,
		"pytest tests/a.py::test_b":     false,
		"go test . -run Report":         false,
		"go test ./classify":            false,
		"vitest run tests/cart.test.js": false,
		"git status":                    false,
	} {
		if actual := classifier.IsFullTestRun(text, classifier.Classify(text)); actual != want {
			t.Errorf("%s is %v, want %v", text, actual, want)
		}
	}
}
