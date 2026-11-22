<?php

declare(strict_types=1);

namespace App\Agents\Commands\RetireMenuEntry;

use App\Actors\Contracts\JournalAdmission;
use App\Actors\Support\ActorIdentity;
use App\Agents\Exceptions\MenuEntryRefused;
use App\Agents\Models\MenuEntry;
use App\Contracts\CommandHandler;

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
