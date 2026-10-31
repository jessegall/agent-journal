// Command anonymise reads JSON bodies on stdin, one a line, and writes them anonymised: go run ./cmd/anonymise <private words file>.
// The file holds one private word a line and lives outside the repository.
package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/anonymise"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Fprintln(os.Stderr, "usage: anonymise <private words file>")
		os.Exit(2)
	}
	text, err := os.ReadFile(os.Args[1])
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	var words []string
	for _, line := range strings.Split(string(text), "\n") {
		if word := strings.TrimSpace(line); word != "" {
			words = append(words, word)
		}
	}
	if err := anonymise.New(words).Bodies(os.Stdin, os.Stdout); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
