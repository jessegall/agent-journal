package hostapi

import "strings"

// ShieldRule is a screen the journal named as one the host must never send: enough of its keywords appear on it, in
// any case. The host matches the rows as plain text and knows nothing of the program that drew them.
type ShieldRule struct {
	Keywords    []string `json:"keywords"`
	MinKeywords int      `json:"min_keywords"`
}

// matches is whether enough of the rule's keywords appear on the rows.
func (rule ShieldRule) matches(rows []string) bool {
	text := strings.ToLower(strings.Join(rows, "\n"))
	present := 0
	for _, keyword := range rule.Keywords {
		if strings.Contains(text, strings.ToLower(keyword)) {
			present++
		}
	}
	return rule.MinKeywords > 0 && present >= rule.MinKeywords
}

// isShielded is whether any of the rules matches the rows.
func isShielded(rules []ShieldRule, rows []string) bool {
	for _, rule := range rules {
		if rule.matches(rows) {
			return true
		}
	}
	return false
}
