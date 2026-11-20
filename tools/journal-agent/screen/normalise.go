package screen

import (
	"regexp"
	"strings"
	"unicode"
)

// emailAddress matches an address a program prints, such as the signed-in account on a status screen.
var emailAddress = regexp.MustCompile(`[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}`)

// filePath matches a home path (~/a) or an absolute path of two or more segments (/a/b), with the character before
// it, so a slash command such as /model and a fraction such as 3/4 stay as they are.
var filePath = regexp.MustCompile(`(^|[^\w~/.])(~/[^\s/]+|/[^\s/]+/)[^\s]*`)

// wordRun is a run of the characters a token is written in.
var wordRun = regexp.MustCompile(`[A-Za-z0-9_-]+`)

// digitRun is the number a fingerprint ignores, such as the count in "3 servers connected".
var digitRun = regexp.MustCompile(`[0-9]+`)

// tokenPrefixes start the keys of known services: OpenAI, GitHub and Slack.
var tokenPrefixes = []string{"sk-", "ghp_", "xox"}

// Redact masks what must never leave the host: email addresses, file paths and token-like strings. Case and spacing
// are kept.
func Redact(text string) string {
	masked := filePath.ReplaceAllString(emailAddress.ReplaceAllString(text, "<redacted>"), "${1}<path>")

	return wordRun.ReplaceAllStringFunc(masked, func(run string) string {
		if !isToken(run) {
			return run
		}

		return "<token>"
	})
}

// isToken is whether a run of letters, digits, - and _ looks like a key: it starts as a known service's key does,
// or it is 20 or more characters long and holds both a letter and a digit.
func isToken(run string) bool {
	for _, prefix := range tokenPrefixes {
		if len(run) > len(prefix) && strings.HasPrefix(run, prefix) {
			return true
		}
	}

	return len(run) >= 20 && strings.ContainsFunc(run, unicode.IsLetter) && strings.ContainsFunc(run, unicode.IsDigit)
}

// Normalise is the text a screen fingerprint is made of, and loses detail on purpose: it redacts, lower-cases,
// removes the highlight markers, collapses white space to one space and writes every number as #. Proof never uses it.
func Normalise(text string, markers []string) string {
	normalised := strings.ToLower(Redact(text))
	for _, marker := range markers {
		normalised = strings.ReplaceAll(normalised, strings.ToLower(marker), "")
	}

	return digitRun.ReplaceAllString(collapseSpaces(normalised), "#")
}

// collapseSpaces writes every run of white space, no-break spaces too, as one space and trims the ends.
func collapseSpaces(text string) string {
	return strings.Join(strings.Fields(text), " ")
}
