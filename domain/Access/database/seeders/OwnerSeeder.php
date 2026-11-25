<?php

declare(strict_types=1);

namespace Domain\Access\Database\Seeders;

use App\Commands\Inboxes\ProvisionActorInbox\ProvisionActorInboxCommand;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use App\Support\ActorIdentity;
use Domain\Access\Models\User;
use Illuminate\Database\Seeder;

/**
 * Creates the local owner account, so the running app can be signed into. Set JOURNAL_OWNER_EMAIL to its email
 * (owner@journal.local); creating it grants nothing by itself.
 */
final class OwnerSeeder extends Seeder
{
    public function run(JournalCommands $commands): void
    {
        $owner = $this->owner();

        if ($owner->wasRecentlyCreated) {
            $commands->runAsJournal(
                CommandEntry::HostControl,
                'desk install',
                new ProvisionActorInboxCommand(ActorIdentity::of($owner), $owner->name),
            );
        }
    }

    /**
     * The local owner, made the first time it is asked for.
     */
    public function owner(): User
    {
        return User::installOwner('Owner', 'owner@journal.local', 'password');
    }
}
