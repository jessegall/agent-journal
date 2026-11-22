<?php

declare(strict_types=1);

namespace App\Commands\RetireMenuEntry;

use App\Contracts\CommandHandler;
use App\Contracts\JournalAdmission;
use App\Exceptions\MenuEntryRefused;
use App\Models\MenuEntry;
use App\Support\ActorIdentity;

final readonly class RetireMenuEntryHandler implements CommandHandler
{
    public function __construct(private JournalAdmission $admission) {}

    /**
     * @throws MenuEntryRefused
     */
    public function handle(RetireMenuEntryCommand $command): string
    {
        $entry = MenuEntry::query()
            ->ownedBy(ActorIdentity::of($this->admission->owner()))
            ->whereKey($command->entryId)
            ->lockForUpdate()
            ->firstOr(fn () => throw MenuEntryRefused::notFound($command->entryId));

        if ($entry->state !== $command->expectedState) {
            throw MenuEntryRefused::changedSinceRead($entry->id, $command->expectedState, $entry->state);
        }

        $entry->retire();

        return $entry->id;
    }
}
