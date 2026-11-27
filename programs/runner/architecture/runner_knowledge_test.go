package architecture

import (
	"go/ast"
	"go/parser"
	"go/token"
	"io/fs"
	"path/filepath"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"testing"
)

// runnerPackages are the host's runner: it hands Docker what the journal sends and decides nothing itself (doc 145).
var runnerPackages = []string{"host", "hostapi"}

// journalRoutes are the journal's own routes the runner calls, and the kernel's own files it reads of a process it
// runs natively: the only paths it may name.
var journalRoutes = []string{"/host/", "/proc/"}

// shellWords are the commands a script is made of; the runner writes no script, so none of them is a word of its own.
var shellWords = regexp.MustCompile(`^(sh|bash|mkdir|chown|chmod|rm|git|tar|find|stat|readlink|cat)$|(^|\s)(sh -c|mkdir |chown |chmod |rm -|git |tar -)`)

// absolutePath is a text that names a folder or file of a machine or a container.
var absolutePath = regexp.MustCompile(`^/[A-Za-z]`)

func TestTheRunnerNamesNoFolderOfAContainerOrOfTheDaemon(t *testing.T) {
	for _, literal := range runnerLiterals(t) {
		isAllowed := slices.ContainsFunc(journalRoutes, func(prefix string) bool { return strings.HasPrefix(literal.text, prefix) })
		if absolutePath.MatchString(literal.text) && !isAllowed {
			t.Errorf("%s names the path %q: the journal sends every folder in its payloads (doc 145)", literal.place, literal.text)
		}
	}
}

func TestTheRunnerWritesNoScript(t *testing.T) {
	for _, literal := range runnerLiterals(t) {
		if shellWords.MatchString(literal.text) {
			t.Errorf("%s holds the shell text %q: every script is the journal's, run as a container it sends (doc 145)", literal.place, literal.text)
		}
	}
}

// agentWord is the word for what runs in the containers, which the runner never needs: it knows Docker processes only.
var agentWord = regexp.MustCompile(`(?i)agent`)

// moduleImport is the Go module's own import path, which names the module and not what the runner knows.
var moduleImport = regexp.MustCompile(`^journal-runner(/|$)`)

func TestTheRunnerKnowsNoAgent(t *testing.T) {
	for _, file := range runnerFiles(t) {
		for _, group := range file.tree.Comments {
			if agentWord.MatchString(group.Text()) {
				t.Errorf("%s says agent in a comment: the runner knows Docker processes only (doc 145)", file.fileSet.Position(group.Pos()))
			}
		}
		ast.Inspect(file.tree, func(node ast.Node) bool {
			switch named := node.(type) {
			case *ast.ImportSpec:
				return false
			case *ast.Ident:
				if agentWord.MatchString(named.Name) {
					t.Errorf("%s names %s: the runner knows Docker processes only (doc 145)", file.fileSet.Position(named.Pos()), named.Name)
				}
			case *ast.BasicLit:
				text, err := strconv.Unquote(named.Value)
				if err == nil && agentWord.MatchString(text) && !moduleImport.MatchString(text) {
					t.Errorf("%s holds the text %q: the runner knows Docker processes only (doc 145)", file.fileSet.Position(named.Pos()), text)
				}
			}
			return true
		})
	}
}

func TestOnlyTheManifestBecomesADockerContainer(t *testing.T) {
	for _, file := range runnerFiles(t) {
		if filepath.Base(file.name) == "container.go" {
			continue
		}
		ast.Inspect(file.tree, func(node ast.Node) bool {
			composite, isComposite := node.(*ast.CompositeLit)
			if !isComposite {
				return true
			}
			selector, isSelector := composite.Type.(*ast.SelectorExpr)
			if isSelector && selector.Sel.Name == "Config" && isPackage(selector.X, "container") {
				t.Errorf("%s builds a Docker container of its own: only the manifest the journal sends becomes one (doc 145)",
					file.fileSet.Position(composite.Pos()))
			}
			return true
		})
	}
}

// literal is one string literal of the runner and where it stands.
type literal struct {
	text  string
	place token.Position
}

// parsedFile is one Go file of the runner, parsed.
type parsedFile struct {
	name    string
	tree    *ast.File
	fileSet *token.FileSet
}

func runnerLiterals(t *testing.T) []literal {
	t.Helper()
	var found []literal
	for _, file := range runnerFiles(t) {
		ast.Inspect(file.tree, func(node ast.Node) bool {
			basic, isBasic := node.(*ast.BasicLit)
			if !isBasic || basic.Kind != token.STRING {
				return true
			}
			text, err := strconv.Unquote(basic.Value)
			if err == nil {
				found = append(found, literal{text: text, place: file.fileSet.Position(basic.Pos())})
			}
			return true
		})
	}
	return found
}

// runnerFiles are the runner's own Go files, its tests and generated files left out.
func runnerFiles(t *testing.T) []parsedFile {
	t.Helper()
	var files []parsedFile
	for _, folder := range runnerPackages {
		err := filepath.WalkDir(filepath.Join("..", folder), func(path string, entry fs.DirEntry, err error) error {
			if err != nil {
				return err
			}
			if entry.IsDir() && path != filepath.Join("..", folder) {
				return filepath.SkipDir
			}
			isOwn := strings.HasSuffix(path, ".go") && !strings.HasSuffix(path, "_test.go") && !strings.HasSuffix(path, "_gen.go")
			if entry.IsDir() || !isOwn {
				return nil
			}
			fileSet := token.NewFileSet()
			tree, err := parser.ParseFile(fileSet, path, nil, parser.ParseComments)
			if err != nil {
				return err
			}
			files = append(files, parsedFile{name: path, tree: tree, fileSet: fileSet})
			return nil
		})
		if err != nil {
			t.Fatal(err)
		}
	}
	return files
}

func isPackage(expression ast.Expr, name string) bool {
	identifier, isIdentifier := expression.(*ast.Ident)
	return isIdentifier && identifier.Name == name
}
