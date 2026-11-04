package shell

import "testing"

func TestReadDiscards(t *testing.T) {
	cases := []struct {
		line, bare     string
		stdout, stderr bool
		hasDiscard     bool
	}{
		{"npm test > /dev/null", "npm test", true, false, true},
		{"npm test >/dev/null", "npm test", true, false, true},
		{"npm test 1>/dev/null", "npm test", true, false, true},
		{"npm test >> /dev/null", "npm test", true, false, true},
		{"npm test 2>/dev/null", "npm test", false, true, true},
		{"npm test >/dev/null 2>&1", "npm test", true, true, true},
		{"npm test 2>&1 >/dev/null", "npm test", true, false, true},
		{"npm test &>/dev/null", "npm test", true, true, true},
		{"npm test 2>/dev/null >/dev/null", "npm test", true, true, true},
		{"npm test > out.txt 2>/dev/null", "npm test > out.txt", false, true, true},
		{"npm test 2>&1", "npm test 2>&1", false, false, false},
		{"npm test > out.txt", "npm test > out.txt", false, false, false},
		{"npm test", "npm test", false, false, false},
		{"npm test > /dev/null --watch", "npm test > /dev/null --watch", false, false, false},
		{`echo "x > /dev/null"`, `echo "x > /dev/null"`, false, false, false},
		{"npm test > /dev/nullish", "npm test > /dev/nullish", false, false, false},
		{"npm test; echo x > /dev/null", "npm test; echo x > /dev/null", false, false, false},
	}
	for _, testCase := range cases {
		t.Run(testCase.line, func(t *testing.T) {
			read := ReadDiscards(testCase.line)
			if read.Bare != testCase.bare || read.Stdout != testCase.stdout || read.Stderr != testCase.stderr || read.HasDiscard != testCase.hasDiscard {
				t.Fatalf("read %+v", read)
			}
		})
	}
}
