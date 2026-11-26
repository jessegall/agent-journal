<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Isolation;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\BoundaryItem;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Agents\Values\BoundaryMechanism;
use App\Agents\Values\BoundaryMechanisms;
use App\Values\SandboxVerdict;

/**
 * What each pinned driver can apply on each platform before its tools run, given whether Claude Code's own sandbox
 * runs there. A mechanism listed here still needs a recorded run before its item counts as enforced.
 */
final readonly class IsolationMechanisms
{
    public function for(IsolationPlatform $platform, string $family, SandboxVerdict $sandbox): BoundaryMechanisms
    {
        $isClaude = $family === DefaultDrivers::CLAUDE_CODE;

        return match ($platform) {
            IsolationPlatform::Darwin => $isClaude ? $this->claudeOnDarwin() : $this->codexOnDarwin(),
            IsolationPlatform::Linux => $isClaude ? $this->claudeWith($sandbox) : $this->codexOnLinux(),
            IsolationPlatform::Container => $isClaude ? $this->claudeInContainer($sandbox) : $this->codexOnLinux(),
            IsolationPlatform::ProtectedContainer => $isClaude ? $this->claudeProtected() : $this->codexProtected(),
            IsolationPlatform::Other => BoundaryMechanisms::allUnavailable(
                'the pinned clients have no tool sandbox on this platform',
            ),
        };
    }

    private function claudeWith(SandboxVerdict $sandbox): BoundaryMechanisms
    {
        if (! $sandbox->isRunnable) {
            return BoundaryMechanisms::allUnavailable($sandbox->why);
        }

        return $this->claudeSandbox();
    }

    /**
     * In the agent image each session has its own history volume, so its history holds where Claude's sandbox runs.
     */
    private function claudeInContainer(SandboxVerdict $sandbox): BoundaryMechanisms
    {
        if (! $sandbox->isRunnable) {
            return BoundaryMechanisms::allUnavailable($sandbox->why);
        }

        return $this->claudeSandbox()->with(
            BoundaryItem::ForeignHistory,
            BoundaryMechanism::native("each session's own history volume over the account's projects folder"),
        );
    }

    /**
     * How Claude Code's bubblewrap sandbox applies each item once bwrap and socat run.
     */
    private function claudeSandbox(): BoundaryMechanisms
    {
        return new BoundaryMechanisms([
            BoundaryItem::AccountSecrets->value => BoundaryMechanism::native(
                "sandbox.enabled with permissions.deny Read on the account's sign-in items: the bubblewrap mount "
                .'namespace for Bash and its children, the permission check for file tools',
            ),
            BoundaryItem::ForeignHistory->value => BoundaryMechanism::unavailable(
                'every session of an account keeps its history in one projects folder, and a native read rule '
                ."cannot tell this session's history from another's",
            ),
            BoundaryItem::Keychain->value => BoundaryMechanism::native(
                'sandbox.enabled bubblewrap namespace without the session D-Bus socket, and permissions.deny on '
                .'Bash(secret-tool:*)',
            ),
            BoundaryItem::ControlSockets->value => BoundaryMechanism::native(
                'sandbox.enabled bubblewrap namespace with no allowed Unix sockets',
            ),
            BoundaryItem::ProcessInspection->value => BoundaryMechanism::native(
                'sandbox.enabled bubblewrap PID namespace',
            ),
            BoundaryItem::InstallWrites->value => BoundaryMechanism::native(
                'sandbox.enabled writes only in the work folder, and permissions.deny Edit on the accounts folder',
            ),
        ]);
    }

    /**
     * How a protected-account start keeps each item from the model's tools without Claude Code's own sandbox: every
     * command the model runs is a process of the executor's user 10002, and the file tools obey the managed policy.
     */
    private function claudeProtected(): BoundaryMechanisms
    {
        return new BoundaryMechanisms([
            BoundaryItem::AccountSecrets->value => BoundaryMechanism::native(
                'uid 10002 executor through CLAUDE_CODE_SHELL for Bash and its children, which cannot read the '
                .'account folder of uid 10001; managed permissions.deny on the account folder for the file tools',
            ),
            BoundaryItem::ForeignHistory->value => BoundaryMechanism::native(
                "each session's own history volume over the account's projects folder",
            ),
            BoundaryItem::Keychain->value => BoundaryMechanism::native(
                "the agent image runs no session D-Bus or secret service, and the executor's uid 10002 reaches "
                .'nothing of uid 10001',
            ),
            BoundaryItem::ControlSockets->value => BoundaryMechanism::native(
                'the executor socket admits only uid 10001, and the commands of uid 10002 reach no socket of the '
                .'program',
            ),
            BoundaryItem::ProcessInspection->value => BoundaryMechanism::native(
                'the client runs as another uid: /proc environ, fd, root and mem of uid 10001 are refused to uid '
                .'10002',
            ),
            BoundaryItem::InstallWrites->value => BoundaryMechanism::native(
                'uid 10002 writes only the workspace (group journal-work) and /tmp; /opt and /etc are root-owned, '
                .'and the managed policy denies Edit outside /workspace and /tmp',
            ),
        ]);
    }

    /**
     * How a protected-account start keeps each item from Codex's tools: every command, PTY and patch runs in the
     * executor's uid 10002, and the tools that would read in Codex's own process are off.
     */
    private function codexProtected(): BoundaryMechanisms
    {
        return new BoundaryMechanisms([
            BoundaryItem::AccountSecrets->value => BoundaryMechanism::native(
                'every command, PTY and patch runs in the uid 10002 executor through environments.toml with '
                .'include_local = false, which cannot read the account folder of uid 10001; view_image and code '
                .'mode are off',
            ),
            BoundaryItem::ForeignHistory->value => BoundaryMechanism::native(
                'the threads under CODEX_HOME belong to uid 10001, and the commands and patches of uid 10002 '
                .'cannot read them',
            ),
            BoundaryItem::Keychain->value => BoundaryMechanism::native(
                "the agent image runs no session D-Bus or secret service, and the executor's uid 10002 reaches "
                .'nothing of uid 10001',
            ),
            BoundaryItem::ControlSockets->value => BoundaryMechanism::native(
                'the executor socket admits only uid 10001, and the commands of uid 10002 reach no socket of the '
                .'program',
            ),
            BoundaryItem::ProcessInspection->value => BoundaryMechanism::native(
                'Codex runs as another uid: /proc environ, fd, root and mem of uid 10001 are refused to uid 10002',
            ),
            BoundaryItem::InstallWrites->value => BoundaryMechanism::native(
                'uid 10002 writes only the workspace (group journal-work) and /tmp, patches included; /opt and '
                .'/etc are root-owned',
            ),
        ]);
    }

    private function codexOnLinux(): BoundaryMechanisms
    {
        return new BoundaryMechanisms([
            BoundaryItem::AccountSecrets->value => BoundaryMechanism::unavailable(
                'the workspace-write Landlock sandbox limits writes only, so a command can read auth.json under '
                .'CODEX_HOME',
            ),
            BoundaryItem::ForeignHistory->value => BoundaryMechanism::unavailable(
                "the workspace-write Landlock sandbox limits writes only, so a command can read other threads' "
                .'sessions',
            ),
            BoundaryItem::Keychain->value => BoundaryMechanism::unavailable(
                'Codex has no setting that refuses the session D-Bus secret service to its commands',
            ),
            BoundaryItem::ControlSockets->value => BoundaryMechanism::unavailable(
                "Codex's seccomp filter refuses network sockets but not Unix sockets",
            ),
            BoundaryItem::ProcessInspection->value => BoundaryMechanism::unavailable(
                "Codex's sandbox shares the process namespace of the host",
            ),
            BoundaryItem::InstallWrites->value => BoundaryMechanism::native(
                "the workspace-write Landlock sandbox: writes only in the work folder and the thread's writable "
                .'roots',
            ),
        ]);
    }

    private function claudeOnDarwin(): BoundaryMechanisms
    {
        return new BoundaryMechanisms([
            BoundaryItem::AccountSecrets->value => BoundaryMechanism::native(
                "sandbox.enabled with permissions.deny Read on the account's sign-in items: the Seatbelt profile "
                .'for Bash and its children, the permission check for file tools',
            ),
            BoundaryItem::ForeignHistory->value => BoundaryMechanism::native(
                "the host's session Seatbelt profile (sandbox-exec) around the program: only the projects folder "
                ."of the session's own workspace can be read or written",
            ),
            BoundaryItem::Keychain->value => BoundaryMechanism::native(
                'sandbox.enabled Seatbelt profile with allowUnsandboxedCommands false, and permissions.deny on '
                .'Bash(security:*)',
            ),
            BoundaryItem::ControlSockets->value => BoundaryMechanism::native(
                'sandbox.enabled Seatbelt profile with no allowed Unix sockets',
            ),
            BoundaryItem::ProcessInspection->value => BoundaryMechanism::native(
                "the host's session Seatbelt profile (sandbox-exec) around the program: no process information "
                .'about or signal to a process outside the session',
            ),
            BoundaryItem::InstallWrites->value => BoundaryMechanism::native(
                'sandbox.enabled writes only in the work folder, and permissions.deny Edit on the accounts folder',
            ),
        ]);
    }

    private function codexOnDarwin(): BoundaryMechanisms
    {
        return new BoundaryMechanisms([
            BoundaryItem::AccountSecrets->value => BoundaryMechanism::unavailable(
                'the workspace-write Seatbelt sandbox limits writes only, so a command can read auth.json under '
                .'CODEX_HOME',
            ),
            BoundaryItem::ForeignHistory->value => BoundaryMechanism::unavailable(
                "the workspace-write Seatbelt sandbox limits writes only, so a command can read other threads' "
                .'sessions',
            ),
            BoundaryItem::Keychain->value => BoundaryMechanism::unavailable(
                'Codex has no setting that refuses Keychain services to its commands',
            ),
            BoundaryItem::ControlSockets->value => BoundaryMechanism::unavailable(
                'Codex has no setting that refuses Unix sockets to its commands',
            ),
            BoundaryItem::ProcessInspection->value => BoundaryMechanism::unavailable(
                "Codex's Seatbelt sandbox has no setting that hides the other processes of the same user",
            ),
            BoundaryItem::InstallWrites->value => BoundaryMechanism::native(
                "the workspace-write Seatbelt sandbox: writes only in the work folder and the thread's writable "
                .'roots',
            ),
        ]);
    }
}
