package shell

import "testing"

func TestARetryLoopIsALoopThatWaitsAndLeavesOrTests(t *testing.T) {
	retries := []string{
		`for i in 1 2 3; do git commit -m x && break; sleep 2; done`,
		`for i in 1 2 3; do git commit -m x && break; python3 -c 'import time; time.sleep(2)'; done; git log -1`,
		`until grep -q ready log; do sleep 1; done`,
		`while ! make; do sleep 5; done`,
	}
	for _, line := range retries {
		if !IsRetryLoop(line) {
			t.Errorf("%q is a retry loop", line)
		}
	}
}

func TestOrdinaryLoopsAndLinesAreNoRetryLoops(t *testing.T) {
	plain := []string{
		`for file in a b c; do wc -l "$file"; done`,
		`for file in a b; do grep -q x "$file" && break; done`,
		`for file in a b; do touch "$file"; sleep 1; done`,
		`sleep 1 && echo done`,
		`echo 'for i in 1; do break; sleep 1; done'`,
	}
	for _, line := range plain {
		if IsRetryLoop(line) {
			t.Errorf("%q is no retry loop", line)
		}
	}
}
