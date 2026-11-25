<?php

declare(strict_types=1);

namespace App\Commands\Navigation\RetireMenuEntry;

use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Bus\CommandHandler;
use App\Exceptions\MenuEntryRefused;
use App\Models\Drivers\MenuEntry;
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
            ->firstOr(MenuEntryRefused::throwing()->notFound($command->entryId));

        if ($entry->status !== $command->expectedState) {
            throw MenuEntryRefused::changedSinceRead($entry->id, $command->expectedState, $entry->status);
        }

        $entry->retire();

        return $entry->id;
    }
}
