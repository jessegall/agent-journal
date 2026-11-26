package hostapi

import (
	"regexp"
)

var placeholderPattern = regexp.MustCompile(`\{([a-z]+):([^{}]*)\}`)

// Placeholders are the only names the host fills into an order's text: folders it wrote itself and names on the
// installer's list.
type Placeholders struct {
	Folders   map[string]string
	HostNames map[string]string
}

// Fill replaces each {folder:<name>} and {host:<NAME>} in the text; any other placeholder, or a name the host does
// not hold, refuses the order as unsafe.
func (placeholders Placeholders) Fill(text string) (string, error) {
	var refusal error
	filled := placeholderPattern.ReplaceAllStringFunc(text, func(placeholder string) string {
		parts := placeholderPattern.FindStringSubmatch(placeholder)
		value, found := placeholders.valueOf(parts[1], parts[2])
		if !found && refusal == nil {
			refusal = RefusalError{Refusal: Unsafe, Reason: "the order names an unknown placeholder " + placeholder}
		}
		return value
	})
	if refusal != nil {
		return "", refusal
	}
	return filled, nil
}

func (placeholders Placeholders) valueOf(kind, name string) (string, bool) {
	switch kind {
	case "folder":
		value, found := placeholders.Folders[name]
		return value, found
	case "host":
		value, found := placeholders.HostNames[name]
		return value, found
	}
	return "", false
}
