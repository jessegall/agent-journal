<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReportEntryReplayed;
use App\Agents\Enums\HoldReason;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Exceptions\NavigationRaiseRefused;
use App\Agents\Models\MenuEntry;
use App\Agents\Support\HostRuntimes;
use App\Contracts\CommandHandler;

/**
 * Counts a replay of a library entry that worked, lists the runtime's build on it, and lets the runtime go on if it
 * was held for navigation.
 */
final readonly class ReportEntryReplayedHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes) {}

    /**
     * @throws HostReportRefused
     * @throws NavigationRaiseRefused
     */
    public function handle(ReportEntryReplayed $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);
        $entry = MenuEntry::query()->acrossActors()->whereKey($command->entryId)->lockForUpdate()->firstOr(
            fn () => throw NavigationRaiseRefused::unknownEntry($command->entryId),
        );

        $entry->recordReplay($command->operationKey, $runtime->program_build);
        if ($runtime->hold_reason === HoldReason::NavigationNeeded) {
            $runtime->holdFor(HoldReason::None);
        }
    }
}
