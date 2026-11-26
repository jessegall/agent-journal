<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\BoundaryItem;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Agents\Drivers\Isolation\IsolationMechanisms;
use App\Agents\Values\BoundaryMechanisms;
use Tests\TestCase;

/**
 * The isolation table names a mechanism for every item on every platform: every item native in the protected
 * container, nothing on a host, and in the standard container only each Claude Code session's own history.
 */
final class IsolationMechanismsTest extends TestCase
{
    public function test_only_the_protected_container_keeps_the_items_and_no_driver_sandbox_counts(): void
    {
        $every = ['account-secrets', 'foreign-history', 'keychain', 'control-sockets', 'process-inspection', 'install-writes'];

        $this->journal->assertResult(
            [
                'darwin claude' => [],
                'linux claude' => [],
                'container claude' => ['foreign-history'],
                'protected claude' => $every,
                'container codex' => [],
                'protected codex' => $every,
                'other codex' => [],
            ],
            [
                'darwin claude' => $this->native(IsolationPlatform::Darwin, DefaultDrivers::CLAUDE_CODE),
                'linux claude' => $this->native(IsolationPlatform::Linux, DefaultDrivers::CLAUDE_CODE),
                'container claude' => $this->native(IsolationPlatform::Container, DefaultDrivers::CLAUDE_CODE),
                'protected claude' => $this->native(IsolationPlatform::ProtectedContainer, DefaultDrivers::CLAUDE_CODE),
                'container codex' => $this->native(IsolationPlatform::Container, DefaultDrivers::CODEX),
                'protected codex' => $this->native(IsolationPlatform::ProtectedContainer, DefaultDrivers::CODEX),
                'other codex' => $this->native(IsolationPlatform::Other, DefaultDrivers::CODEX),
            ],
        );
    }

    public function test_an_unconfined_start_gives_one_reason_for_every_item(): void
    {
        $mechanisms = $this->app->make(IsolationMechanisms::class)->for(IsolationPlatform::Linux, DefaultDrivers::CODEX);

        $this->journal->assertResult(
            [BoundaryMechanisms::unconfined()->of(BoundaryItem::AccountSecrets)->text],
            array_values(array_unique(array_map(fn (BoundaryItem $item) => $mechanisms->of($item)->text, BoundaryItem::cases()))),
        );
    }

    /**
     * @return list<string>
     */
    private function native(IsolationPlatform $platform, string $family): array
    {
        return $this->nativeOf($this->app->make(IsolationMechanisms::class)->for($platform, $family));
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
