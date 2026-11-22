<?php

declare(strict_types=1);

namespace Domain\Access\Console;

use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Illuminate\Console\Command;

final class DisableUserCommand extends Command
{
    protected $signature = 'access:user-disable
        {email : The address of the account}
        {--enable : Enable the account again instead}';

    protected $description = 'Disable a user account so it is admitted nowhere, or enable it again';

    public function handle(): int
    {
        $user = User::query()->where('email', (string) $this->argument('email'))->firstOrFail();

        if ($this->option('enable') === true) {
            $user->enable();
            $this->info("Enabled {$user->email}.");

            return self::SUCCESS;
        }

        $user->disable(CarbonImmutable::now());
        $this->info("Disabled {$user->email}.");

        return self::SUCCESS;
    }
}
