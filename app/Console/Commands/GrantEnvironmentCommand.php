<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\Access\GrantEnvironmentAccess\GrantEnvironmentAccessCommand;
use App\Commands\Access\RevokeEnvironmentAccess\RevokeEnvironmentAccessCommand;
use App\Contracts\Bus\OwnerCommands;
use App\Enums\Messages\InboxPermission;
use App\Models\Access\User;
use Illuminate\Console\Command;

final class GrantEnvironmentCommand extends Command
{
    protected $signature = 'access:grant
        {email : The address of the user}
        {--environment= : The environment id; this installation when left out}
        {--open-inboxes : May open inboxes}
        {--manage-members : May add and remove inbox members}
        {--receive-invitations : May be invited into inboxes}
        {--revoke : Revoke the user\'s grant instead}';

    protected $description = 'Admit a user to the inboxes of an environment with the permissions named, or revoke it';

    public function handle(OwnerCommands $commands): int
    {
        $user = User::query()->withEmail((string) $this->argument('email'))->firstOrFail();
        $environmentId = $this->option('environment');
        $environment = is_string($environmentId) && $environmentId !== '' ? $environmentId : null;

        if ($this->option('revoke') === true) {
            $commands->run(new RevokeEnvironmentAccessCommand($user->id, $environment));
            $this->info("Revoked the grant of {$user->email}.");

            return self::SUCCESS;
        }

        $permissions = array_values(array_filter(
            InboxPermission::cases(),
            fn (InboxPermission $permission) => $this->option(str_replace('_', '-', $permission->value)) === true,
        ));

        $commands->run(new GrantEnvironmentAccessCommand($user->id, $environment, $permissions));
        $this->info("Granted {$user->email}.");

        return self::SUCCESS;
    }
}
