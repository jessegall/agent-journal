package screen

import "testing"

func TestAnEntryIsFoundByItsWholeLabelAfterItsNumberAndBeforeItsNote(t *testing.T) {
	entries := MenuEntries{Labels: []string{
		"1.  Default (recommended) ✔  Opus 5.5 · Best for everyday, complex tasks",
		"2.  Opus 5.5                 For complex work and everyday tasks",
		"3.  Low",
		"GPT-6-Sol-Mini  Small",
		"GPT-6-Sol  Legacy",
		"GPT-6.1-Sol (current)  Previous generation model",
	}}

	cases := map[string]int{"Opus 5.5": 1, "low": 2, "GPT-6-Sol": 4, "Default (recommended)": 0, "GPT-6.1-Sol": 5}
	for label, want := range cases {
		if index, found := entries.Find(label); !found || index != want {
			t.Fatalf("%q was found at %d, %v; it is entry %d", label, index, found, want)
		}
	}
	for _, label := range []string{"Opus", "GPT-6", "Haiku 5.5", "5.5"} {
		if index, found := entries.Find(label); found {
			t.Fatalf("%q was taken for entry %d, which is not its label", label, index)
		}
	}
}

func TestALabelOnTwoEntriesIsNotFound(t *testing.T) {
	entries := MenuEntries{Labels: []string{"1. Low  fast", "2. Low  cheap"}}

	if _, found := entries.Find("Low"); found {
		t.Fatal("a label two entries hold was taken for one of them")
	}
}
