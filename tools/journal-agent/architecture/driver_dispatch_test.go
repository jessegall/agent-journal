// Package architecture holds tests that judge the Go host's source as a whole.
package architecture

import (
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"testing"
)

// driverDispatch finds code that chooses what to do by a driver's name or concrete type: a comparison with a driver
// key, a case on one, a test for headless in a key, or a type assertion to a concrete driver.
var driverDispatch = regexp.MustCompile(
	`(==|!=)\s*"(claude|claude-code|codex)(-headless)?"` +
		`|case "(claude|claude-code|codex)(-headless)?"` +
		`|strings\.(Contains|HasSuffix)\([^)]*"headless"\)` +
		`|\.\(\*?(drivers\.)?[A-Z][A-Za-z]*Driver\)`,
)

// driverDispatchAllowed are the places that may name a driver: the profiles, which are the drivers' own adapters,
// and the journal command's verb a person types to start Codex locally.
var driverDispatchAllowed = []string{
	"profiles/",
	"cmd/journal/main.go",
}

// DriverDispatchIn is every line of the source that dispatches on a driver's name or concrete type.
func DriverDispatchIn(name, source string) []string {
	found := []string{}
	for number, line := range strings.Split(source, "\n") {
		if driverDispatch.MatchString(line) {
			found = append(found, name+":"+strconv.Itoa(number+1)+": "+strings.TrimSpace(line))
		}
	}
	return found
}

func TestNoHostCodeDispatchesOnADriverName(t *testing.T) {
	found := []string{}
	err := filepath.WalkDir("..", func(path string, entry fs.DirEntry, err error) error {
		if err != nil || entry.IsDir() || !strings.HasSuffix(path, ".go") || strings.HasSuffix(path, "_test.go") {
			return err
		}
		relative := strings.TrimPrefix(filepath.ToSlash(path), "../")
		for _, allowed := range driverDispatchAllowed {
			if strings.HasPrefix(relative, allowed) {
				return nil
			}
		}
		source, readErr := os.ReadFile(path)
		if readErr != nil {
			return readErr
		}
		found = append(found, DriverDispatchIn(relative, string(source))...)
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if len(found) > 0 {
		t.Fatalf("code outside the driver profiles dispatches on a driver name; ask the profile instead:\n%s",
			strings.Join(found, "\n"))
	}
}

func TestTheCheckCatchesCodeThatDispatchesOnClaudeCode(t *testing.T) {
	fixture := "if registration.Key == \"claude-code\" {\n\treturn nil\n}\nheadless := runtime.(*drivers.HeadlessDriver)\n"

	if found := DriverDispatchIn("fixture.go", fixture); len(found) != 2 {
		t.Fatalf("the fixture's two dispatches were found as %v", found)
	}
}
