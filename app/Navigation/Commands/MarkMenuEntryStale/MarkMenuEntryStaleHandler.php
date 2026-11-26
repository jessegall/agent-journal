<?php

declare(strict_types=1);

namespace App\Navigation\Commands\MarkMenuEntryStale;

use App\Access\Contracts\JournalAdmission;
use App\Bus\Contracts\CommandHandler;
use App\Exceptions\HostReportRefused;
use App\Exceptions\NavigationRaiseRefused;
use App\Hosts\HostRuntimes;
use App\Models\Drivers\MenuEntry;

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
    public function handle(MarkMenuEntryStaleCommand $command): void
    {
        if (count($command->rows) > self::MOST_ROWS) {
            throw NavigationRaiseRefused::tooManyRows(count($command->rows), self::MOST_ROWS);
        }

        $this->runtimes->lockedFor($command->hostId, $command->runtimeId);

        $entry = MenuEntry::query()
            ->ownedBy($this->admission->owner())
            ->whereKey($command->entryId)
            ->lockForUpdate()
            ->firstOr(NavigationRaiseRefused::throwing()->unknownEntry($command->entryId));

        if ($entry->buildOn($command->build)?->isStale === true) {
            return;
        }

        $rows = array_map(fn (string $row) => mb_substr($row, 0, self::MOST_ROW_CHARACTERS), $command->rows);
        $entry->markStaleOn($command->build, "{$command->reason->value} at step {$command->step}", $rows);
    }
}
