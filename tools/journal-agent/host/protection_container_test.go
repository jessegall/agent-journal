package host

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"journal-agent/client"
)

const containerImage = "sha256:" + "c97cd8c276ef3e646ae0feee9690ff29f23b1c4692e456fe3c66966c57805cd1"

// agentDaemon is a fake agent daemon whose agent image answers each check with the given shell.
func agentDaemon(t *testing.T, answer string) (Containers, string) {
	t.Helper()
	calls := filepath.Join(t.TempDir(), "calls")
	daemon := fakeImageDocker(t, `echo "$*" >> `+calls+"\n"+answer)
	daemon.Rules = ContainerRules{Arrangement: Contained, InstallationName: "journal", AgentImage: containerImage}

	return daemon, calls
}

func TestTheContainerPlatformRunsClaudesSandboxInTheAgentImage(t *testing.T) {
	daemon, calls := agentDaemon(t, "exit 0")

	platform := ContainedPlatform(context.Background(), daemon, "/etc/journal/security/seccomp-agent.json")
	capability, err := InspectProtection(platform, "claude", "2.1.323", NativeEvidence{Folder: t.TempDir()})
	if err != nil {
		t.Fatal(err)
	}

	if capability.Platform != ContainerPlatform || capability.Available {
		t.Fatalf("got platform %s available %v, want linux-container and refused without evidence",
			capability.Platform, capability.Available)
	}
	for _, item := range capability.Items {
		if item.Mechanism.Native == "" || !strings.HasPrefix(item.Reason, "native evidence missing") {
			t.Fatalf("item %s has no mechanism or is not refused for missing evidence: %+v", item.Item, item)
		}
	}

	ran, _ := os.ReadFile(calls)
	for _, want := range []string{
		"run --rm --network none --cap-drop ALL --security-opt no-new-privileges --user 10001:10001",
		"--security-opt seccomp=/etc/journal/security/seccomp-agent.json --entrypoint bwrap " + containerImage,
		"--entrypoint socat " + containerImage + " -V",
		"--proc /proc",
	} {
		if !strings.Contains(string(ran), want) {
			t.Fatalf("the checks did not run %q in the agent image: %s", want, ran)
		}
	}
}

func TestASandboxThatDoesNotStartInTheContainerNamesItsCause(t *testing.T) {
	daemon, _ := agentDaemon(t, `case "$*" in *bwrap*) echo "bwrap: Can't mount proc on /newroot/proc: Operation not permitted"; exit 1 ;; esac`)

	platform := ContainedPlatform(context.Background(), daemon, "")
	capability, err := InspectProtection(platform, "claude", "2.1.323", NativeEvidence{Folder: t.TempDir()})
	if err != nil {
		t.Fatal(err)
	}

	for _, item := range capability.Items {
		if item.Enforced || !strings.Contains(item.Reason, "Can't mount proc on /newroot/proc") {
			t.Fatalf("item %s does not name why the sandbox cannot start: %+v", item.Item, item)
		}
	}
}

func TestOnlyEvidenceOfTheSameAgentImageCountsInAContainer(t *testing.T) {
	daemon, _ := agentDaemon(t, "exit 0")
	folder := t.TempDir()
	shown := map[BoundaryItem]string{}
	for _, item := range BoundaryItems {
		shown[item] = "run-7"
	}
	writeEvidence(t, folder, map[string]map[BoundaryItem]string{
		"claude@2.1.323/linux":                            shown,
		"claude@2.1.323/linux-container@sha256:" + "0000": shown,
	})

	platform := ContainedPlatform(context.Background(), daemon, "")
	refused, err := InspectProtection(platform, "claude", "2.1.323", NativeEvidence{Folder: folder})
	if err != nil {
		t.Fatal(err)
	}

	if refused.Available {
		t.Fatal("evidence of the host's own Linux or of another image counted for the agent image")
	}

	writeEvidence(t, folder, map[string]map[BoundaryItem]string{"claude@2.1.323/linux-container@" + containerImage: shown})
	enforced, err := InspectProtection(platform, "claude", "2.1.323", NativeEvidence{Folder: folder})
	if err != nil {
		t.Fatal(err)
	}

	if !enforced.Available {
		t.Fatalf("evidence of the agent image did not enforce its items: %+v", enforced.Items)
	}
}

func TestCodexStaysUnavailableInAContainer(t *testing.T) {
	daemon, _ := agentDaemon(t, "exit 0")

	capability, err := InspectProtection(ContainedPlatform(context.Background(), daemon, ""), "codex", "0.165.0",
		NativeEvidence{Folder: t.TempDir()})
	if err != nil {
		t.Fatal(err)
	}

	if capability.Available || capability.Items[0].Mechanism.Native != "" {
		t.Fatalf("Codex reported a mechanism for account secrets in a container: %+v", capability.Items[0])
	}
}

type protectionReports []client.ProtectionReport

func (reports *protectionReports) ReportProtection(_ context.Context, report client.ProtectionReport) error {
	*reports = append(*reports, report)

	return nil
}

func TestAContainedHostReportsEachProgramAtTheBuildTheAgentImageHolds(t *testing.T) {
	daemon, _ := agentDaemon(t, `case "$*" in
*"--entrypoint claude "*) echo "2.1.323 (Claude Code)" ;;
*"--entrypoint codex "*) echo "codex-cli 0.165.0" ;;
*bwrap*) echo "bwrap: Can't mount proc on /newroot/proc: Operation not permitted"; exit 1 ;;
esac`)
	reports := protectionReports{}

	evidence := NativeEvidence{Folder: t.TempDir()}
	if err := ReportContainedProtection(context.Background(), daemon, "", evidence, &reports); err != nil {
		t.Fatal(err)
	}

	if len(reports) != 4 || reports[0].Driver != "claude-code" || reports[0].Build != "2.1.323" ||
		reports[1].Platform != ProtectedContainerPlatform || reports[1].Driver != "claude-code" ||
		reports[2].Driver != "codex" || reports[2].Build != "0.165.0" || reports[3].Platform != ProtectedContainerPlatform {
		t.Fatalf("got reports %+v, want claude-code 2.1.323 and codex 0.165.0, each standard then protected", reports)
	}

	claude := reports[0]
	if claude.Platform != ContainerPlatform || len(claude.Items) != len(BoundaryItems) {
		t.Fatalf("the Claude report is not one of linux-container with every item: %+v", claude)
	}

	for _, item := range claude.Items {
		if item.Enforced || !strings.Contains(item.Reason, "Can't mount proc") {
			t.Fatalf("item %s is enforced or does not name why the sandbox cannot start: %+v", item.Item, item)
		}
	}
}

// A protected start keeps each item by its two users and the managed policy, not by Claude Code's sandbox: its report
// names those mechanisms even where bwrap cannot start, and still counts an item only with native evidence of this
// agent image.
func TestTheProtectedReportNamesTheExecutorAndTheManagedPolicyAndNeedsEvidence(t *testing.T) {
	daemon, _ := agentDaemon(t, `case "$*" in *bwrap*) echo "bwrap: Can't mount proc"; exit 1 ;; esac`)
	folder := t.TempDir()

	capability, err := InspectProtection(ProtectedPlatform(daemon), "claude", "2.1.323", NativeEvidence{Folder: folder})
	if err != nil {
		t.Fatal(err)
	}
	if capability.Platform != ProtectedContainerPlatform || capability.Available {
		t.Fatalf("a protected report without evidence counts as available: %+v", capability)
	}
	secrets := capability.Items[0]
	if secrets.Item != AccountSecrets || !strings.Contains(secrets.Mechanism.Native, "uid 10002 executor") ||
		!strings.Contains(secrets.Mechanism.Native, "managed permissions.deny") {
		t.Fatalf("the account secrets item does not name the executor and the managed policy: %+v", secrets)
	}
	for _, item := range capability.Items {
		if item.Mechanism.Native == "" {
			t.Fatalf("item %s has no protected mechanism: %+v", item.Item, item)
		}
	}

	records := map[string]map[BoundaryItem]string{}
	key := "claude@2.1.323/" + ProtectedContainerPlatform + "@" + containerImage
	records[key] = map[BoundaryItem]string{}
	for _, item := range BoundaryItems {
		records[key][item] = "run-protected-1"
	}
	writeEvidence(t, folder, records)

	capability, err = InspectProtection(ProtectedPlatform(daemon), "claude", "2.1.323", NativeEvidence{Folder: folder})
	if err != nil || !capability.Available {
		t.Fatalf("the protected report with this image's evidence is not available: %+v, %v", capability, err)
	}

	codex, err := InspectProtection(ProtectedPlatform(daemon), "codex", "0.165.0", NativeEvidence{Folder: folder})
	if err != nil || codex.Available || !strings.Contains(codex.Items[0].Reason, "executor") {
		t.Fatalf("Codex's protected report does not say why it is unavailable: %+v, %v", codex, err)
	}
}
