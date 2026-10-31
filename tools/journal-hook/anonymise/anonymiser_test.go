package anonymise

import (
	"strings"
	"testing"
)

// Each sample line beside what version 4's anonymised(line, ["Acme", "acme-corp"]) gives for it with the home folder /Users/alice.
var samples = []struct {
	line     string
	expected string
}{
	{"export GH=ghp_abcdefghijklmnopqrstuvwxyz0123456789", "export GH=ghp_EXAMPLE"},
	{"git clone https://github_pat_11ABCDEFG0123456789_abcdefghijk@github.com/o/r", "git clone https://someone@example.com/o/r"},
	{"curl -H 'Authorization: Bearer abc.DEF-123_xyz' https://api.example.com", "curl -H 'Authorization: Bearer EXAMPLE-TOKEN' https://api.example.com"},
	{"ANTHROPIC_API_KEY=sk-ant-abcdefghijklmnopqrstuvwx python run.py", "ANTHROPIC_API_KEY=EXAMPLE python run.py"},
	{"aws configure set key AKIAABCDEFGHIJKLMNOP", "aws configure set key AKIAEXAMPLE"},
	{"aws configure set key AKIAABCDEFGHIJKLMNOPQ", "aws configure set key AKIAABCDEFGHIJKLMNOPQ"},
	{"slack xoxb-1234567890-abcdefghij", "slack xoxb-EXAMPLE"},
	{`mysql -u root --password="hunter22" db`, `mysql -u root --password="EXAMPLE" db`},
	{"echo token = 'abc", "echo token EXAMPLE 'abc"},
	{"cmd --api-key 'x y'", "cmd --api-key 'x y'"},
	{"gh auth --token abc123 status", "gh auth --token EXAMPLE status"},
	{"tool --key=abc", "tool --key=EXAMPLE"},
	{"DB_PASSWORD='p@ss' ./start", "DB_PASSWORD='EXAMPLE' ./start"},
	{"git remote add o https://bob:s3cret@git.example.org/r.git", "git remote add o https://bob:someone@example.com/r.git"},
	{"-----BEGIN RSA PRIVATE KEY-----\nMIIabc\n-----END RSA PRIVATE KEY-----", "-----BEGIN KEY-----EXAMPLE-----END KEY-----"},
	{"export X=AbCdEfGhIjKlMnOpQrStUvWxYz0123456789abcd", "export X=EXAMPLE-KEY"},
	{"git show 0123456789abcdef0123456789abcdef01234567", "git show 0123456789abcdef0123456789abcdef01234567"},
	{"ssh alice@10.1.2.3 cat /Users/alice/notes.txt /home/bob/x /Users/alice", "ssh someone@example.com cat ~/notes.txt ~/x ~"},
	{"ping 192.168.1.20 && curl http://10.0.0.5:8080/", "ping 10.0.0.1 && curl http://10.0.0.1:8080/"},
	{"pip install x==1.2.3.4.5", "pip install x==10.0.0.1.5"},
	{"cd /tmp/alice-work && ls -Users-alice-projects", "cd /tmp/user-work && ls -Users-user-projects"},
	{"git clone git@github.com:ACME-Corp/acme.git", "git clone someone@example.com:project/project.git"},
	{"xghp_abcdefghijklmnopqrstuvwxyz", "xghp_abcdefghijklmnopqrstuvwxyz"},
	{"éghp_abcdefghijklmnopqrstuvwxyz", "éghp_abcdefghijklmnopqrstuvwxyz"},
	{"  ls \n", "ls"},
}

func TestAnonymisedMatchesVersion4(t *testing.T) {
	anonymiser := NewFor("/Users/alice", []string{"Acme", "acme-corp"})
	for _, sample := range samples {
		if got := anonymiser.Anonymised(sample.line); got != sample.expected {
			t.Errorf("anonymised(%q)\n got  %q\n want %q", sample.line, got, sample.expected)
		}
	}
}

func TestReplacedKeepsTheWhitespace(t *testing.T) {
	anonymiser := NewFor("/Users/alice", nil)
	if got := anonymiser.Replaced("  cat /Users/alice/a\n"); got != "  cat ~/a\n" {
		t.Errorf("replaced gave %q", got)
	}
}

func TestBodiesAnonymiseEveryStringAndKeepTheRest(t *testing.T) {
	anonymiser := NewFor("/Users/alice", []string{"Acme"})
	input := `{"cwd":"/Users/alice/acme","tool_input":{"command":"echo password=\"x\\\" y\" <a>","lines":[1,"ab@cd.io "]},"fired_at_ms":1793395000123}` + "\n"
	var output strings.Builder
	if err := anonymiser.Bodies(strings.NewReader(input), &output); err != nil {
		t.Fatal(err)
	}
	expected := `{"cwd":"~/project","fired_at_ms":1793395000123,"tool_input":{"command":"echo password=\"EXAMPLE\" y\" <a>","lines":[1,"someone@example.com "]}}` + "\n"
	if output.String() != expected {
		t.Errorf("bodies gave\n %s want\n %s", output.String(), expected)
	}
}

func TestBodiesRefuseALineThatIsNotJSON(t *testing.T) {
	if err := NewFor("/Users/alice", nil).Bodies(strings.NewReader("not json\n"), &strings.Builder{}); err == nil {
		t.Error("a line that is not JSON went through")
	}
}
