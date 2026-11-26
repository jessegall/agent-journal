<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\NotifyEntryReplayed;

use App\Agents\Drivers\Enums\HoldReason;
use App\Bus\Contracts\CommandHandler;
use App\Exceptions\HostReportRefused;
use App\Exceptions\NavigationRaiseRefused;
use App\Hosts\HostRuntimes;
use App\Models\Drivers\MenuEntry;

/**
 * Counts a replay of a library entry that worked, lists the runtime's build on it, and lets the runtime go on if it
 * was held for navigation.
 */
final readonly class NotifyEntryReplayedHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes) {}

    /**
     * @throws HostReportRefused
     * @throws NavigationRaiseRefused
     */
    public function handle(NotifyEntryReplayedCommand $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);

        $entry = MenuEntry::query()->acrossActors()->whereKey($command->entryId)->lockForUpdate()->firstOr(
            NavigationRaiseRefused::throwing()->unknownEntry($command->entryId),
        );

        $entry->recordReplay($command->operationKey, $runtime->driver_build);

        if ($runtime->hold_reason === HoldReason::NavigationNeeded) {
            $runtime->holdFor(HoldReason::None);
        }
    }
}
