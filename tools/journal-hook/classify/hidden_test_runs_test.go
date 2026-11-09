package classify

import "testing"

func TestATestRunHiddenBehindAnotherProgramIsStillATestRun(t *testing.T) {
	classifier := NewClassifier(LoadTable(""))
	for _, text := range []string{
		"pytest tests/a.py",
		"python3 -m pytest tests/a.py",
		"python -m pytest tests/a.py",
		".venv/bin/pytest tests/a.py",
		".venv/bin/python -m pytest tests/a.py",
		".venv/bin/python3 -u -m pytest tests/a.py",
		"env A=1 pytest tests/a.py",
		"A=1 pytest tests/a.py",
		"bash -c 'pytest tests/a.py'",
		"sh -c 'pytest tests/a.py'",
		"zsh -c 'python3 -m pytest tests/a.py'",
		"bash -lc 'pytest tests/a.py'",
		"eval 'pytest tests/a.py'",
		"timeout 60 pytest tests/a.py",
		"nice pytest tests/a.py",
		"nohup pytest tests/a.py",
		"command pytest tests/a.py",
		"exec pytest tests/a.py",
		"time pytest tests/a.py",
		"xargs pytest",
		"find tests -name '*.py' | xargs pytest",
		"(pytest tests/a.py)",
		"cd tests && pytest a.py",
		"ls && pytest tests/a.py",
		"pytest tests/a.py | tail -5",
		"pytest tests/a.py > out.txt",
		"make test",
		"npm test",
		"npm run test",
		"npx vitest run tests/a.test.js",
		"node_modules/.bin/vitest run tests/a.test.js",
		"src/viewer/node_modules/.bin/vitest run tests/a.test.js",
		"go test ./classify",
		"go -C tools test ./classify",
		"uv run pytest tests/a.py",
		"poetry run pytest tests/a.py",
		"tox",
		"nox",
	} {
		if actual := classifier.ClassifyLine(text).Category; actual != "test run" {
			t.Errorf("%s is %q, want a test run", text, actual)
		}
	}
}

// A worker is refused every process and unknown command, so a test hidden in one of these cannot run; a story proves it.
func TestAProgramTheLineCannotJudgeIsAProcessOrUnknown(t *testing.T) {
	classifier := NewClassifier(LoadTable(""))
	for text, want := range map[string]string{
		"python3 hidden.py":                                         "process",
		"python3 -c 'import pytest; pytest.main([])'":               "process",
		"python3 -c 'import subprocess; subprocess.run([\"pytest\"])'": "process",
		"node src/viewer/node_modules/vitest/vitest.mjs run":        "process",
		"sh hidden.sh":                                              "process",
		"bash hidden.sh":                                            "process",
		"coverage run -m pytest tests/a.py":                         "unknown",
		"./hidden.sh":                                               "unknown",
	} {
		if actual := classifier.ClassifyLine(text).Category; actual != want {
			t.Errorf("%s is %q, want %q", text, actual, want)
		}
	}
}
