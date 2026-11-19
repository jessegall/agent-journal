package screen

import "testing"

func TestRedactMasksAddressesPathsAndTokensAndKeepsCaseAndSpacing(t *testing.T) {
	cases := map[string]string{
		"Signed in as Ann.Lee@Example.com":           "Signed in as <redacted>",
		"cwd  /Users/ann/projects/journal":           "cwd  <path>",
		"Folder: ~/work":                             "Folder: <path>",
		"Key sk-proj-abc ready":                      "Key <token> ready",
		"ghp_abc and xoxb-123":                       "<token> and <token>",
		"id a1b2c3d4e5f6g7h8i9j0k":                   "id <token>",
		"Type /model to switch, 3/4 done":            "Type /model to switch, 3/4 done",
		"A Very-Long-Plain-Word-Without-Any-Numbers": "A Very-Long-Plain-Word-Without-Any-Numbers",
	}
	for text, want := range cases {
		if got := Redact(text); got != want {
			t.Fatalf("Redact(%q) is %q, want %q", text, got, want)
		}
	}
}

func TestNormaliseLetsCountsAddressesAndPathsDifferWithoutChangingTheFingerprintText(t *testing.T) {
	markers := []string{"❯"}
	equal := [][2]string{
		{"3 servers connected", "5 servers connected"},
		{"Signed in as ann@example.com", "signed in as bob@example.org"},
		{"Folder ~/work", "Folder ~/home/other"},
		{"❯ 1.  Opus  5.5 ", "  2. opus 4.1"},
	}
	for _, pair := range equal {
		if Normalise(pair[0], markers) != Normalise(pair[1], markers) {
			t.Fatalf("%q and %q normalise to %q and %q", pair[0], pair[1],
				Normalise(pair[0], markers), Normalise(pair[1], markers))
		}
	}
	if got := Normalise("  3  Servers Connected ", nil); got != "# servers connected" {
		t.Fatalf("normalised to %q", got)
	}
}
