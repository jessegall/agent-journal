<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Contracts\DriverIsolation;
use App\Agents\Drivers\Enums\BoundaryItem;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Agents\Values\BoundaryMechanism;
use App\Agents\Values\BoundaryMechanisms;

/**
 * What keeps each boundary item from Codex's tools: only the protected container's two users. The journal never uses
 * Codex's own sandbox.
 */
final readonly class CodexIsolation implements DriverIsolation
{
    public function mechanismsOn(IsolationPlatform $platform): BoundaryMechanisms
    {
        if ($platform === IsolationPlatform::ProtectedContainer) {
            return $this->codexProtected();
        }

        return BoundaryMechanisms::unconfined();
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
                .'driver',
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
}
