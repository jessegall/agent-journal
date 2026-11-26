<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\DriverIsolation;
use App\Agents\Drivers\Enums\BoundaryItem;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Agents\Values\BoundaryMechanism;
use App\Agents\Values\BoundaryMechanisms;

/**
 * What keeps each boundary item from Claude Code's tools: the protected container's two users, and in the standard
 * container only each session's own history volume. The journal never uses Claude Code's own sandbox.
 */
final readonly class ClaudeCodeIsolation implements DriverIsolation
{
    public function mechanismsOn(IsolationPlatform $platform): BoundaryMechanisms
    {
        return match ($platform) {
            IsolationPlatform::ProtectedContainer => $this->claudeProtected(),
            IsolationPlatform::Container => BoundaryMechanisms::unconfined()->with(
                BoundaryItem::ForeignHistory,
                BoundaryMechanism::native("each session's own history volume over the account's projects folder"),
            ),
            default => BoundaryMechanisms::unconfined(),
        };
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
                .'driver',
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
}
