// Package anonymise is version 4's anonymised() from scripts/corpus_commands.py in Go: the same patterns in the same order.
package anonymise

import (
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"unicode/utf8"

	"github.com/jessegall/agent-journal/tools/journal-hook/internal/pyre"
)

// A pattern and what stands in for it. Go has no \b for Unicode words and no backreferences: a rule whose Python pattern
// starts or ends with \b checks the boundary itself, and a quoted value is spelled out once for each quote.
type rule struct {
	pattern       *regexp.Regexp
	template      string
	boundaryStart bool
	boundaryEnd   bool
	accepts       func(match string) bool
}

var secrets = []rule{
	{pattern: regexp.MustCompile(`(gh[pousr]_)[A-Za-z0-9]{20,}`), template: "${1}EXAMPLE", boundaryStart: true},
	{pattern: regexp.MustCompile(`github_pat_[A-Za-z0-9_]{20,}`), template: "github_pat_EXAMPLE", boundaryStart: true},
	{pattern: regexp.MustCompile(`sk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}`), template: "sk-EXAMPLE", boundaryStart: true},
	{pattern: regexp.MustCompile(`xox[abprs]-[A-Za-z0-9-]{10,}`), template: "xoxb-EXAMPLE", boundaryStart: true},
	{pattern: regexp.MustCompile(`AKIA[0-9A-Z]{16}`), template: "AKIAEXAMPLE", boundaryStart: true, boundaryEnd: true},
	{pattern: regexp.MustCompile(`(?i)(bearer)[` + pyre.Space + `]+[A-Za-z0-9._~+/=-]{8,}`), template: "${1} EXAMPLE-TOKEN", boundaryStart: true},
	{pattern: regexp.MustCompile(`(?i)((?:[A-Z0-9_]*_)?(?:password|passwd|pwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|client[_-]?secret)[A-Z0-9_]*)([` + pyre.Space + `]*[=:][` + pyre.Space + `]*|[` + pyre.Space + `]+)(?:(')[^` + pyre.Space + `'"&|;]+'|(")[^` + pyre.Space + `'"&|;]+"|[^` + pyre.Space + `'"&|;]+)`), template: "${1}${2}${3}${4}EXAMPLE${3}${4}", boundaryStart: true},
	{pattern: regexp.MustCompile(`(--(?:password|token|secret|api-key|key))(=|[` + pyre.Space + `]+)(?:(')[^` + pyre.Space + `'"]+'|(")[^` + pyre.Space + `'"]+"|[^` + pyre.Space + `'"]+)`), template: "${1}${2}${3}${4}EXAMPLE${3}${4}"},
	{pattern: regexp.MustCompile(`(://[^/` + pyre.Space + `:@]+):[^@` + pyre.Space + `/]+@`), template: "${1}:EXAMPLE@"},
	{pattern: regexp.MustCompile(`(?s)-----BEGIN [A-Z ]*KEY-----.*?-----END [A-Z ]*KEY-----`), template: "-----BEGIN KEY-----EXAMPLE-----END KEY-----"},
	{pattern: regexp.MustCompile(`[A-Za-z0-9+/_-]{40,}={0,2}`), template: "EXAMPLE-KEY", boundaryStart: true, accepts: mixedKey},
}

var (
	email       = rule{pattern: regexp.MustCompile(`[` + pyre.Word + `.+-]+@[` + pyre.Word + `-]+(?:\.[` + pyre.Word + `-]+)+`), template: "someone@example.com"}
	address     = rule{pattern: regexp.MustCompile(`(?:[` + pyre.Digit + `]{1,3}\.){3}[` + pyre.Digit + `]{1,3}`), template: "10.0.0.1", boundaryStart: true, boundaryEnd: true}
	homeFolder  = rule{pattern: regexp.MustCompile(`/(?:Users|home)/[^/` + pyre.Space + `'"]*`), template: "~"}
	lowerLetter = regexp.MustCompile(`[a-z]`)
	upperLetter = regexp.MustCompile(`[A-Z]`)
	digitLetter = regexp.MustCompile(`[0-9]`)
)

// Anonymiser makes emails, keys, tokens, passwords, addresses, home folders, the user's name and the private words neutral.
type Anonymiser struct {
	home         string
	user         string
	privateWords []*regexp.Regexp
}

// New anonymises for the user running it, as version 4 does with Path.home().
func New(privateWords []string) Anonymiser {
	home, _ := os.UserHomeDir()
	return NewFor(home, privateWords)
}

func NewFor(home string, privateWords []string) Anonymiser {
	items := append([]string(nil), privateWords...)
	sort.SliceStable(items, func(i, j int) bool { return utf8.RuneCountInString(items[i]) > utf8.RuneCountInString(items[j]) })
	patterns := make([]*regexp.Regexp, len(items))
	for i, word := range items {
		patterns[i] = regexp.MustCompile(`(?i)` + regexp.QuoteMeta(word))
	}
	return Anonymiser{home: home, user: filepath.Base(home), privateWords: patterns}
}

// Anonymised is version 4's anonymised(line, private_words): every replacement, then the line stripped.
func (anonymiser Anonymiser) Anonymised(line string) string {
	return pyre.Strip(anonymiser.Replaced(line))
}

// Replaced makes every replacement Anonymised does and keeps the whitespace around the text.
func (anonymiser Anonymiser) Replaced(text string) string {
	for _, secret := range secrets {
		text = secret.apply(text)
	}
	text = email.apply(text)
	text = homeFolder.apply(strings.ReplaceAll(address.apply(text), anonymiser.home, "~"))
	text = strings.ReplaceAll(text, anonymiser.user, "user")
	for _, word := range anonymiser.privateWords {
		text = word.ReplaceAllLiteralString(text, "project")
	}
	return text
}

// apply replaces each match as Python's re.sub does: a match the boundary check refuses is passed over and the search goes
// on from the next character.
func (secret rule) apply(text string) string {
	var replaced []byte
	retained, searchStart := 0, 0
	for searchStart <= len(text) {
		span := secret.pattern.FindStringSubmatchIndex(text[searchStart:])
		if span == nil {
			break
		}
		for i := range span {
			if span[i] < 0 {
				continue
			}
			span[i] += searchStart
		}
		start, end := span[0], span[1]
		// every later start inside a refused run is a part of it, which the check refuses too
		if secret.accepts != nil && !secret.accepts(text[start:end]) {
			searchStart = end
			continue
		}
		if (secret.boundaryStart && !pyre.IsBoundary(text, start)) || (secret.boundaryEnd && !pyre.IsBoundary(text, end)) {
			_, size := utf8.DecodeRuneInString(text[start:])
			searchStart = start + max(size, 1)
			continue
		}
		replaced = append(replaced, text[retained:start]...)
		replaced = secret.pattern.ExpandString(replaced, secret.template, text, span)
		retained, searchStart = end, end
	}
	return string(append(replaced, text[retained:]...))
}

// A long run counts as a key only when it holds a lowercase letter, an uppercase letter and a digit.
func mixedKey(match string) bool {
	run := strings.TrimRight(match, "=")
	return lowerLetter.MatchString(run) && upperLetter.MatchString(run) && digitLetter.MatchString(run)
}
