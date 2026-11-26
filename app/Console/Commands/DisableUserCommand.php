<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Access\Commands\DisableUser\DisableUserCommand as DisableUser;
use App\Bus\Contracts\OwnerCommands;
use App\Models\Access\User;
use Illuminate\Console\Command;

final class DisableUserCommand extends Command
{
    protected $signature = 'access:user-disable
        {email : The address of the account}
        {--enable : Enable the account again instead}';

    protected $description = 'Disable a user account so it is admitted nowhere, or enable it again';

    public function handle(OwnerCommands $commands): int
    {
        $user = User::query()->withEmail((string) $this->argument('email'))->firstOrFail();

        if ($this->option('enable') === true) {
            $user->enable();
            $this->info("Enabled {$user->email}.");

            return self::SUCCESS;
        }

        $commands->run(new DisableUser($user->id));
        $this->info("Disabled {$user->email}.");

        return self::SUCCESS;
    }
}
