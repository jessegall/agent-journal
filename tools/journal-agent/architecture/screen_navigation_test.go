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

// screenReading finds Go code that classifies a driver's screen or runs a key script against it: the classifier, its
// Classify answer, or a key script run.
var screenReading = regexp.MustCompile(`screen\.NewClassifier\(|\.Classify\((time\.Now|now)|keyscripts\.Run\(`)

// navigationFolders are the only places that read a driver's screens and answer them: the screen package, the key
// scripts, the drivers that run them, and the host command that wires one terminal driver together.
var navigationFolders = []string{"screen/", "keyscripts/", "drivers/", "cmd/journal-agent/"}

// ScreenReadingIn is every line of the source that reads or answers a driver's screen.
func ScreenReadingIn(name, source string) []string {
	found := []string{}
	for number, line := range strings.Split(source, "\n") {
		if screenReading.MatchString(line) {
			found = append(found, name+":"+strconv.Itoa(number+1)+": "+strings.TrimSpace(line))
		}
	}

	return found
}

// isNavigation is whether the file belongs to the screen navigation.
func isNavigation(relative string) bool {
	for _, folder := range navigationFolders {
		if strings.HasPrefix(relative, folder) {
			return true
		}
	}

	return false
}

// A screen, menu or question of a driver is passed only by the screen navigation from its recordings; no other
// package classifies a driver's screen or runs a key script against it.
func TestOnlyTheScreenNavigationReadsADriversScreens(t *testing.T) {
	found := []string{}
	err := filepath.WalkDir("..", func(path string, entry fs.DirEntry, err error) error {
		if err != nil || entry.IsDir() || !strings.HasSuffix(path, ".go") || strings.HasSuffix(path, "_test.go") {
			return err
		}
		relative := strings.TrimPrefix(filepath.ToSlash(path), "../")
		if isNavigation(relative) {
			return nil
		}
		source, readErr := os.ReadFile(path)
		if readErr != nil {
			return readErr
		}
		found = append(found, ScreenReadingIn(relative, string(source))...)

		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if len(found) > 0 {
		t.Fatalf("code outside the screen navigation reads a driver's screen; record the screen and let the "+
			"navigation pass it:\n%s", strings.Join(found, "\n"))
	}
}

// A classifier made outside the navigation is caught, so a bypass written on purpose fails the test above.
func TestTheScanCatchesAClassifierOutsideTheNavigation(t *testing.T) {
	found := ScreenReadingIn("host/bypass.go", "\tclassifier := screen.NewClassifier(layout, reader)\n")

	if len(found) != 1 || isNavigation("host/bypass.go") {
		t.Fatalf("a classifier in host/bypass.go was not caught: %v", found)
	}
}
