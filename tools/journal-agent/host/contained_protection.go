package host

import (
	"context"
	"fmt"
	"regexp"

	"journal-agent/client"
)

// ProtectionReporter is where a contained host sends what it found of each program's protection.
type ProtectionReporter interface {
	NotifyProtection(ctx context.Context, report client.ProtectionReport) error
}

// containedPrograms are the programs a contained host reports on: the journal's name of each, and the name its
// protection specification and the agent image's binary have.
var containedPrograms = []struct{ journal, binary string }{
	{journal: "claude-code", binary: "claude"},
	{journal: "codex", binary: "codex"},
}

var buildVersion = regexp.MustCompile(`\d+\.\d+\.\d+`)

// NotifyContainedProtection inspects each program's protection in the agent image at the build the image holds, under
// the standard and the protected-account start profile, and sends both to the journal, which admits a contained
// start only on the report of its profile with every item enforced.
func NotifyContainedProtection(
	ctx context.Context,
	containers Containers,
	seccomp string,
	evidence NativeEvidence,
	reporter ProtectionReporter,
) error {
	platforms := []ProtectionPlatform{ContainedPlatform(ctx, containers, seccomp), ProtectedPlatform(containers)}
	for _, program := range containedPrograms {
		output, err := containers.RunCheck(ctx, seccomp, program.binary, "--version")
		if err != nil {
			return fmt.Errorf("the agent image does not run %s: %s", program.binary, failureLine(output, err))
		}

		build := buildVersion.FindString(output)
		if build == "" {
			return fmt.Errorf("the agent image's %s names no build: %q", program.binary, output)
		}

		for _, platform := range platforms {
			capability, err := InspectProtection(platform, program.binary, build, evidence)
			if err != nil {
				return err
			}

			if err := reporter.NotifyProtection(ctx, protectionReport(program.journal, capability)); err != nil {
				return err
			}
		}
	}

	return nil
}

func protectionReport(program string, capability ProtectionCapability) client.ProtectionReport {
	report := client.ProtectionReport{Driver: program, Build: capability.Build, Platform: capability.Platform}
	for _, item := range capability.Items {
		report.Items = append(report.Items, client.ProtectionItem{
			Item: string(item.Item), IsEnforced: item.IsEnforced, Evidence: item.Evidence, Reason: item.Reason,
		})
	}

	return report
}
