<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\BoundaryItem;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Agents\Drivers\Isolation\IsolationMechanisms;
use App\Agents\Values\BoundaryMechanisms;
use App\Values\SandboxVerdict;
use Tests\TestCase;

/**
 * The isolation table names a mechanism for every item on every platform: Claude Code's sandbox where it runs and
 * nothing where it does not, Codex native only for its writes outside the protected container, and every item native
 * in the protected container; the agent image gives each session its own history.
 */
final class IsolationMechanismsTest extends TestCase
{
    public function test_each_platform_and_family_names_which_items_are_native(): void
    {
        $runs = SandboxVerdict::runs();
        $refused = SandboxVerdict::refused('no bwrap');

        $this->journal->assertResult(
            [
                'darwin claude' => ['account-secrets', 'foreign-history', 'keychain', 'control-sockets', 'process-inspection', 'install-writes'],
                'linux claude' => ['account-secrets', 'keychain', 'control-sockets', 'process-inspection', 'install-writes'],
                'linux claude without its sandbox' => [],
                'container claude' => ['account-secrets', 'foreign-history', 'keychain', 'control-sockets', 'process-inspection', 'install-writes'],
                'linux codex' => ['install-writes'],
                'protected codex' => ['account-secrets', 'foreign-history', 'keychain', 'control-sockets', 'process-inspection', 'install-writes'],
                'other codex' => [],
            ],
            [
                'darwin claude' => $this->native(IsolationPlatform::Darwin, DefaultDrivers::CLAUDE_CODE, $runs),
                'linux claude' => $this->native(IsolationPlatform::Linux, DefaultDrivers::CLAUDE_CODE, $runs),
                'linux claude without its sandbox' => $this->native(IsolationPlatform::Linux, DefaultDrivers::CLAUDE_CODE, $refused),
                'container claude' => $this->native(IsolationPlatform::Container, DefaultDrivers::CLAUDE_CODE, $runs),
                'linux codex' => $this->native(IsolationPlatform::Linux, DefaultDrivers::CODEX, $runs),
                'protected codex' => $this->native(IsolationPlatform::ProtectedContainer, DefaultDrivers::CODEX, $refused),
                'other codex' => $this->native(IsolationPlatform::Other, DefaultDrivers::CODEX, $runs),
            ],
        );
    }

    public function test_claude_without_its_sandbox_gives_the_probes_reason_for_every_item(): void
    {
        $mechanisms = new IsolationMechanisms()->for(
            IsolationPlatform::Container,
            DefaultDrivers::CLAUDE_CODE,
            SandboxVerdict::refused('bwrap: No permissions to create a new namespace'),
        );

        $this->journal->assertResult(
            ['bwrap: No permissions to create a new namespace'],
            array_values(array_unique(array_map(fn (BoundaryItem $item) => $mechanisms->of($item)->text, BoundaryItem::cases()))),
        );
    }

    /**
     * @return list<string>
     */
    private function native(IsolationPlatform $platform, string $family, SandboxVerdict $sandbox): array
    {
        $mechanisms = new IsolationMechanisms()->for($platform, $family, $sandbox);

        return $this->nativeOf($mechanisms);
    }

    /**
     * @return list<string>
     */
    private function nativeOf(BoundaryMechanisms $mechanisms): array
    {
        $native = array_filter(BoundaryItem::cases(), fn (BoundaryItem $item) => $mechanisms->of($item)->isNative);

        return array_values(array_map(fn (BoundaryItem $item) => $item->value, $native));
    }
}
