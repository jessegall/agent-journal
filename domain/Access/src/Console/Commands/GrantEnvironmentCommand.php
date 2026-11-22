<?php

declare(strict_types=1);

namespace Domain\Access\Console\Commands;

use App\Contracts\Bus\OwnerCommands;
use App\Enums\ChatPermission;
use Domain\Access\Commands\GrantEnvironmentAccess\GrantEnvironmentAccessCommand;
use Domain\Access\Commands\RevokeEnvironmentAccess\RevokeEnvironmentAccessCommand;
use Domain\Access\Models\User;
use Illuminate\Console\Command;

final class GrantEnvironmentCommand extends Command
{
    protected $signature = 'access:grant
        {email : The address of the user}
        {--environment= : The environment id; this installation when left out}
        {--create-chats : May open chats}
        {--manage-members : May add and remove chat members}
        {--receive-invitations : May be invited into chats}
        {--revoke : Revoke the user\'s grant instead}';

    protected $description = 'Admit a user to the chats of an environment with the permissions named, or revoke it';

    public function handle(OwnerCommands $commands): int
    {
        $user = User::query()->where('email', (string) $this->argument('email'))->firstOrFail();
        $environmentId = $this->option('environment');
        $environment = is_string($environmentId) && $environmentId !== '' ? $environmentId : null;

        if ($this->option('revoke') === true) {
            $commands->run(new RevokeEnvironmentAccessCommand($user->id, $environment));
            $this->info("Revoked the grant of {$user->email}.");

            return self::SUCCESS;
        }

        $permissions = array_values(array_filter(
            ChatPermission::cases(),
            fn (ChatPermission $permission) => $this->option(str_replace('_', '-', $permission->value)) === true,
        ));

        $commands->run(new GrantEnvironmentAccessCommand($user->id, $environment, $permissions));
        $this->info("Granted {$user->email}.");

        return self::SUCCESS;
    }
}
