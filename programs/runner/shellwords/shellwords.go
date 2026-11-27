// Package shellwords quotes words for sh.
package shellwords

import "strings"

// Quoted quotes each word for sh, so no word means anything to the shell, and joins them with spaces.
func Quoted(words ...string) string {
	quoted := make([]string, len(words))
	for index, word := range words {
		quoted[index] = "'" + strings.ReplaceAll(word, "'", `'\''`) + "'"
	}

	return strings.Join(quoted, " ")
}
