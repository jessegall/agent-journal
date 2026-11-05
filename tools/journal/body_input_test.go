package main

import (
	"reflect"
	"strings"
	"testing"
)

func TestABodyOfADashComesFromStandardInputWhole(t *testing.T) {
	text := strings.Repeat("`rm -rf a` costs $5 in \"tests/a.py\"\n", 1800)
	filled, err := BodyFromInput([]string{"report", "make", "x", "--body", "-"}, strings.NewReader(text))
	if err != nil || filled[4] != text || len(text) < 60000 {
		t.Fatalf("the body came back as %d characters of %d: %v", len(filled[4]), len(text), err)
	}
}

func TestALineWithNoDashBodyLeavesStandardInputAlone(t *testing.T) {
	for _, argv := range [][]string{{"task", "list"}, {"report", "make", "x", "--body", "text"}, {"report", "make", "--body"}} {
		filled, err := BodyFromInput(argv, strings.NewReader("unread"))
		if err != nil || !reflect.DeepEqual(filled, argv) {
			t.Errorf("%v became %v: %v", argv, filled, err)
		}
	}
}
