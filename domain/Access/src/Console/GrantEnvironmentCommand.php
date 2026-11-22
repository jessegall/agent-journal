<?php

declare(strict_types=1);

namespace Domain\Access\Console;

use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Access\Support\EnvironmentAccess;
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

    public function handle(EnvironmentAccess $access): int
    {
        $user = User::query()->where('email', (string) $this->argument('email'))->firstOrFail();
        $environmentId = $this->option('environment');
        $environment = is_string($environmentId) && $environmentId !== '' ? $environmentId : null;
        $now = CarbonImmutable::now();

        if ($this->option('revoke') === true) {
            $access->revoke($user, $environment, $now);
            $this->info("Revoked the grant of {$user->email}.");

            return self::SUCCESS;
        }

        $permissions = array_values(array_filter(
            ChatPermission::cases(),
            fn (ChatPermission $permission) => $this->option(str_replace('_', '-', $permission->value)) === true,
        ));

        EnvironmentUserGrant::grant($user, $environment, $permissions, ActorIdentity::system(), $now);
        $this->info("Granted {$user->email}.");

        return self::SUCCESS;
    }
}
