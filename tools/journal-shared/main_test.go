package main

import (
	"bytes"
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"database/sql"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"io"
	"math/big"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"
)

var (
	builtBinary string
	buildOnce   sync.Once
	buildError  error
)

// binary builds the real journal-shared once for the tests that start it.
func binary(t *testing.T) string {
	t.Helper()
	buildOnce.Do(func() {
		folder, err := os.MkdirTemp("", "journal-shared-binary")
		if err != nil {
			buildError = err
			return
		}
		builtBinary = filepath.Join(folder, "journal-shared")
		if output, err := exec.Command("go", "build", "-o", builtBinary, ".").CombinedOutput(); err != nil {
			buildError = fmt.Errorf("%v: %s", err, output)
		}
	})
	if buildError != nil {
		t.Fatal(buildError)
	}
	return builtBinary
}

func freeAddress(t *testing.T) string {
	t.Helper()
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	return listener.Addr().String()
}

// startServer runs the real binary with the given serve flags and waits until it answers.
func startServer(t *testing.T, folder, address string, client *http.Client, scheme string, flags ...string) {
	t.Helper()
	command := exec.CommandContext(t.Context(), binary(t), append([]string{"serve", "--data", folder, "--listen", address}, flags...)...)
	var output bytes.Buffer
	command.Stdout, command.Stderr = &output, &output
	if err := command.Start(); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { command.Wait() })
	deadline := time.Now().Add(10 * time.Second)
	for time.Now().Before(deadline) {
		if response, err := client.Get(scheme + "://" + address + "/info"); err == nil {
			response.Body.Close()
			return
		}
		time.Sleep(50 * time.Millisecond)
	}
	t.Fatalf("the server did not answer: %s", output.String())
}

func request(t *testing.T, client *http.Client, method, url, token, body string, headers map[string]string) (int, map[string]any) {
	t.Helper()
	made, err := http.NewRequestWithContext(context.Background(), method, url, strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	made.Header.Set("Journal-Protocol", "1")
	made.Header.Set("Authorization", "Bearer "+token)
	for name, value := range headers {
		made.Header.Set(name, value)
	}
	response, err := client.Do(made)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	text, _ := io.ReadAll(response.Body)
	var parsed map[string]any
	json.Unmarshal(text, &parsed)
	return response.StatusCode, parsed
}

// story1 does what an admin and a person do with curl: the admin adds a user on the server machine, and the person
// reads and writes items over the network.
func story1(t *testing.T, client *http.Client, base, folder string) {
	t.Helper()
	output, status := runIn(t, folder, "user", "add", "Ada", "--role", "admin")
	token := tokenIn(output)
	if status != 0 || token == "" {
		t.Fatalf("%d %s", status, output)
	}
	if code, currentUser := request(t, client, "GET", base+"/me", token, "", nil); code != 200 || currentUser["name"] != "Ada" || currentUser["role"] != "admin" {
		t.Fatalf("/me: %d %v", code, currentUser)
	}
	if code, _ := request(t, client, "GET", base+"/me", "jsl_wrong", "", nil); code != 401 {
		t.Errorf("a wrong token: %d", code)
	}
	code, created := request(t, client, "POST", base+"/items/doc", token, `{"fields": {"title": "Release checklist", "abstract": "Before a release", "body": "Tag first."}}`, nil)
	if code != 201 || created["version"] != float64(1) {
		t.Fatalf("create: %d %v", code, created)
	}
	code, updated := request(t, client, "PUT", base+"/items/doc/1", token, `{"fields": {"body": "Tag first, then build."}}`, map[string]string{"If-Match": `"1"`})
	if code != 200 || updated["version"] != float64(2) {
		t.Fatalf("update: %d %v", code, updated)
	}
	code, read := request(t, client, "GET", base+"/items/doc/1", token, "", nil)
	if fields, _ := read["fields"].(map[string]any); code != 200 || fields["body"] != "Tag first, then build." {
		t.Fatalf("read: %d %v", code, read)
	}
	if code, stale := request(t, client, "PUT", base+"/items/doc/1", token, `{"fields": {"body": "x"}}`, map[string]string{"If-Match": `"1"`}); code != 409 || stale["current"] == nil {
		t.Errorf("a stale update: %d %v", code, stale)
	}
}

func TestStory1OverPlainHTTPWithTheRealBinary(t *testing.T) {
	folder, address := t.TempDir(), freeAddress(t)
	startServer(t, folder, address, http.DefaultClient, "http")
	story1(t, http.DefaultClient, "http://"+address, folder)
}

func TestStory1OverHTTPSWithTheRealBinary(t *testing.T) {
	folder, address := t.TempDir(), freeAddress(t)
	certificate, key, pool := selfSignedFiles(t, t.TempDir())
	client := &http.Client{Transport: &http.Transport{TLSClientConfig: &tls.Config{RootCAs: pool}}}
	startServer(t, folder, address, client, "https", "--tls-cert", certificate, "--tls-key", key)
	story1(t, client, "https://"+address, folder)
	if response, err := http.Get("http://" + address + "/info"); err == nil {
		if response.StatusCode == 200 {
			t.Error("the HTTPS server answered plain HTTP")
		}
		response.Body.Close()
	}
}

func TestServeNeedsBothTLSFilesOrNeither(t *testing.T) {
	output, status := runIn(t, t.TempDir(), "serve", "--tls-cert", "cert.pem")
	if status != 1 || !strings.Contains(output, "go together") {
		t.Errorf("%d %s", status, output)
	}
}

func TestTheServerLimitsHowLongAClientTakesAndListensOnTheLocalMachineByDefault(t *testing.T) {
	server := newServer(defaultListen, nil)
	if server.ReadHeaderTimeout <= 0 || server.ReadTimeout <= 0 || server.WriteTimeout <= 0 || server.IdleTimeout <= 0 {
		t.Errorf("a timeout is not set: %+v", server)
	}
	if defaultListen != "127.0.0.1:8740" {
		t.Errorf("%s", defaultListen)
	}
}

func TestBackupWritesOneFileWithEverythingAndNeverOverwrites(t *testing.T) {
	folder := t.TempDir()
	runIn(t, folder, "user", "add", "Ada", "--role", "admin")
	file := filepath.Join(t.TempDir(), "backup.db")
	if output, status := runIn(t, folder, "backup", file); status != 0 || !strings.Contains(output, "backup written") {
		t.Fatalf("%d %s", status, output)
	}
	copied, err := sql.Open("sqlite", file)
	if err != nil {
		t.Fatal(err)
	}
	defer copied.Close()
	var name string
	if err := copied.QueryRow("SELECT name FROM users").Scan(&name); err != nil || name != "Ada" {
		t.Fatalf("%q, %v", name, err)
	}
	if output, status := runIn(t, folder, "backup", file); status != 1 || !strings.Contains(output, "exists already") {
		t.Errorf("%d %s", status, output)
	}
}

// selfSignedFiles writes a certificate for 127.0.0.1 and its key, and returns a pool that trusts it.
func selfSignedFiles(t *testing.T, folder string) (string, string, *x509.CertPool) {
	t.Helper()
	private, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		t.Fatal(err)
	}
	template := &x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject:      pkix.Name{CommonName: "journal-shared test"},
		NotBefore:    time.Now().Add(-time.Hour),
		NotAfter:     time.Now().Add(time.Hour),
		KeyUsage:     x509.KeyUsageDigitalSignature,
		ExtKeyUsage:  []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		IPAddresses:  []net.IP{net.ParseIP("127.0.0.1")},
	}
	der, err := x509.CreateCertificate(rand.Reader, template, template, &private.PublicKey, private)
	if err != nil {
		t.Fatal(err)
	}
	keyBytes, err := x509.MarshalECPrivateKey(private)
	if err != nil {
		t.Fatal(err)
	}
	certificatePEM := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: der})
	certificate, key := filepath.Join(folder, "cert.pem"), filepath.Join(folder, "key.pem")
	if err := os.WriteFile(certificate, certificatePEM, 0o600); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(key, pem.EncodeToMemory(&pem.Block{Type: "EC PRIVATE KEY", Bytes: keyBytes}), 0o600); err != nil {
		t.Fatal(err)
	}
	pool := x509.NewCertPool()
	pool.AppendCertsFromPEM(certificatePEM)
	return certificate, key, pool
}
