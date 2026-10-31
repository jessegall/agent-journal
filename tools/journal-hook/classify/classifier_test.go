package classify

import (
	"reflect"
	"testing"
)

var shippedClassifier = NewClassifier(LoadTable(""))

// Each command beside what version 4's CommandClassifier reads from it: the program and arguments once its wrappers
// and assignments are off, the subcommand the table names, and the files it prints and writes.
var programCases = []struct {
	text       string
	program    string
	subcommand string
	arguments  []string
	reads      []string
	writes     []string
}{
	{"git status --short", "git", "status", []string{"status", "--short"}, nil, nil},
	{"FOO=1 BAR=2 /usr/bin/git status", "git", "status", []string{"status"}, nil, nil},
	{"timeout 60 cat a.txt b.txt", "cat", "", []string{"a.txt", "b.txt"}, []string{"a.txt", "b.txt"}, nil},
	{"env A=1 cat x", "cat", "", []string{"x"}, []string{"x"}, nil},
	{"cat in.txt > out.txt", "cat", "", []string{"in.txt", ">", "out.txt"}, []string{"in.txt"}, []string{"out.txt"}},
	{"ls -la > /dev/null 2>&1", "ls", "", []string{"-la", ">", "/dev/null", "2>&1"}, nil, nil},
	{"echo done >> log/run.txt", "echo", "", []string{"done", ">>", "log/run.txt"}, nil, []string{"log/run.txt"}},
	{"rm -rf build dist", "rm", "", []string{"-rf", "build", "dist"}, nil, []string{"build", "dist"}},
	{"sed -i s/a/b/ notes.txt", "sed", "", []string{"-i", "s/a/b/", "notes.txt"}, nil, []string{"s/a/b/", "notes.txt"}},
	{"sed -n 1,5p notes.txt", "sed", "", []string{"-n", "1,5p", "notes.txt"}, []string{"1,5p", "notes.txt"}, nil},
	{"tee log.txt", "tee", "", []string{"log.txt"}, nil, []string{"log.txt"}},
	{"cat 'my file.txt'", "cat", "", []string{"my file.txt"}, nil, nil},
	{`python3 -c "open('out/x.txt','w').write('1')"`, "python3", "", []string{"-c", "open('out/x.txt','w').write('1')"}, nil, []string{"out/x.txt"}},
	{"git checkout -- a.py", "git", "checkout", []string{"checkout", "--", "a.py"}, nil, []string{"a.py"}},
	{"unknownprogram --flag x", "unknownprogram", "", []string{"--flag", "x"}, nil, nil},
}

func TestProgramSubcommandArgumentsAndPathsAreReadAsVersion4ReadsThem(t *testing.T) {
	for _, sample := range programCases {
		program, subcommand, arguments := shippedClassifier.Program(sample.text)
		if program != sample.program || subcommand != sample.subcommand || !reflect.DeepEqual(arguments, sample.arguments) {
			t.Errorf("%q: program %q subcommand %q arguments %q", sample.text, program, subcommand, arguments)
		}
		if reads := shippedClassifier.ReadPaths(sample.text); !sameWords(reads, sample.reads) {
			t.Errorf("%q: reads %q, want %q", sample.text, reads, sample.reads)
		}
		if writes := shippedClassifier.WritePaths(sample.text); !sameWords(writes, sample.writes) {
			t.Errorf("%q: writes %q, want %q", sample.text, writes, sample.writes)
		}
	}
}

func TestAPartGetsItsPathsAndTheLineItsRedirects(t *testing.T) {
	line := shippedClassifier.Line("cat a.txt | tee b.txt > /dev/null && rm -f c.txt")
	if len(line.Parts) != 3 {
		t.Fatalf("parts %+v", line.Parts)
	}
	if !reflect.DeepEqual(line.Parts[0].ReadPaths, []string{"a.txt"}) || !reflect.DeepEqual(line.Parts[1].WritePaths, []string{"b.txt"}) || !reflect.DeepEqual(line.Parts[2].WritePaths, []string{"c.txt"}) {
		t.Errorf("paths %+v", line.Parts)
	}
	if !reflect.DeepEqual(line.Redirects, []string{"> /dev/null"}) {
		t.Errorf("redirects %q", line.Redirects)
	}
}

func sameWords(got, want []string) bool {
	return len(got) == len(want) && (len(got) == 0 || reflect.DeepEqual(got, want))
}
