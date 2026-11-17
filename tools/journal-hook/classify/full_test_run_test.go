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
		"composer test":                 true,
		"vendor/bin/phpunit":            true,
		"php artisan test":              true,
		"DB_HOST=127.0.0.1 DB_PORT=54702 vendor/bin/phpunit": true,
		"docker compose -p shop exec -T app composer test":   true,
		"docker compose exec -T -w /app/x app composer test": true,
		"vendor/bin/phpunit tests/Unit/CartTest.php":         false,
		"vendor/bin/phpunit --filter CartTest":               false,
		"composer test - Tests\\Feature\\CartTest":           false,
	} {
		if actual := classifier.IsFullTestRun(text, classifier.Classify(text)); actual != want {
			t.Errorf("%s is %v, want %v", text, actual, want)
		}
	}
}
