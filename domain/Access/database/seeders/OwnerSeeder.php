<?php

declare(strict_types=1);

namespace Domain\Access\Database\Seeders;

use App\Actors\Support\ActorIdentity;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Desks\Commands\ProvisionActorDesk;
use Domain\Access\Models\User;
use Illuminate\Database\Seeder;

/**
 * Creates the local owner account, so the running app can be signed into. Set JOURNAL_OWNER_EMAIL to its email
 * (owner@journal.local); creating it grants nothing by itself.
 */
final class OwnerSeeder extends Seeder
{
    public function run(EntryDispatchers $dispatchers): void
    {
        $owner = User::installOwner('Owner', 'owner@journal.local', 'password');

        if ($owner->wasRecentlyCreated) {
            $dispatchers->runAsJournal(
                CommandEntry::HostControl,
                'desk install',
                new ProvisionActorDesk(ActorIdentity::of($owner), $owner->name),
            );
        }
    }
}
