<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Inboxes\Commands\ProvisionActorInbox\ProvisionActorInboxCommand;
use App\Models\Access\User;
use App\Support\ActorReference;
use Illuminate\Config\Repository;
use Illuminate\Console\Command;
use Illuminate\Contracts\Hashing\Hasher;

/**
 * Makes sure the owner account the installation's settings name exists with the password they give, so its login
 * stays the same across every install and every reset; without both settings it does nothing.
 */
final class EnsureOwnerCommand extends Command
{
    protected $signature = 'access:owner-ensure';

    protected $description = 'Create the owner account from JOURNAL_OWNER_EMAIL and JOURNAL_OWNER_PASSWORD, or reset its password';

    public function handle(Repository $config, Hasher $hasher, JournalCommands $commands): int
    {
        $email = (string) $config->get('access.owner_email');
        $password = (string) $config->get('access.owner_password');

        if ($email === '' || $password === '') {
            $this->info('No owner email and password are set, so no owner account is made.');

            return self::SUCCESS;
        }

        $owner = User::createForInstallation('Owner', $email, $password);

        if ($owner->wasRecentlyCreated) {
            $commands->runAsJournal(
                CommandEntry::HostControl,
                'desk install',
                new ProvisionActorInboxCommand(ActorReference::of($owner), $owner->name),
            );

            $this->info("Created the owner account {$email}.");

            return self::SUCCESS;
        }

        if (! $hasher->check($password, $owner->password)) {
            $owner->changePassword($password);
            $this->info("Set the password of the owner account {$email}.");
        }

        return self::SUCCESS;
    }
}
