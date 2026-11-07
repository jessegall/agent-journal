package classify

import "testing"

func TestSplitReading(t *testing.T) {
	cases := []struct{ arguments, remaining, selection string }{
		{"--tail 5", "", "tail:5"},
		{"--head 12", "", "head:12"},
		{"--cut 100-160", "", "cut:100-160"},
		{"--mode demo --tail 5", "--mode demo", "tail:5"},
		{"--tail 5 --mode demo", "--mode demo", "tail:5"},
		{"--tail 20 -- cart", "cart", "tail:20"},
		{"-- --tail 20", "-- --tail 20", ""},
		{"cart", "cart", ""},
		{"--tail five", "--tail five", ""},
		{"--cut 100", "--cut 100", ""},
		{"", "", ""},
	}
	for _, testCase := range cases {
		t.Run(testCase.arguments, func(t *testing.T) {
			options := splitSavedOptions(testCase.arguments)
			remaining, selection := options.arguments, options.selection
			if remaining != testCase.remaining || selection != testCase.selection {
				t.Fatalf("kept %q, reading %q", remaining, selection)
			}
		})
	}
}
