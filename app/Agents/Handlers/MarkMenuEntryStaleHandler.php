<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\JournalAdmission;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\MarkMenuEntryStale;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Exceptions\NavigationRaiseRefused;
use App\Agents\Models\MenuEntry;
use App\Agents\Support\HostRuntimes;
use App\Contracts\CommandHandler;

/**
 * Marks a library entry stale on the build its replay failed on, keeping it; a build already marked is left as it
 * is, and another build's mark is never touched.
 */
final readonly class MarkMenuEntryStaleHandler implements CommandHandler
{
    private const int MOST_ROWS = 60;

    private const int MOST_ROW_CHARACTERS = 300;

    public function __construct(
        private HostRuntimes $runtimes,
        private JournalAdmission $admission,
    ) {}

    /**
     * @throws HostReportRefused
     * @throws NavigationRaiseRefused
     */
    public function handle(MarkMenuEntryStale $command): void
    {
        if (count($command->rows) > self::MOST_ROWS) {
            throw NavigationRaiseRefused::tooManyRows(count($command->rows), self::MOST_ROWS);
        }

        $this->runtimes->lockedFor($command->hostId, $command->runtimeId);

        $entry = MenuEntry::query()
            ->ownedBy(ActorIdentity::of($this->admission->owner()))
            ->whereKey($command->entryId)
            ->lockForUpdate()
            ->firstOr(fn () => throw NavigationRaiseRefused::unknownEntry($command->entryId));

        if (($entry->builds()[$command->build] ?? null)?->stale === true) {
            return;
        }

        $rows = array_map(fn (string $row) => mb_substr($row, 0, self::MOST_ROW_CHARACTERS), $command->rows);
        $entry->markStaleOn($command->build, "{$command->reason->value} at step {$command->step}", $rows);
    }
}
