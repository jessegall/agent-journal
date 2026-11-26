<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Access\Actions\CreateNewUser;
use Illuminate\Console\Command;

final class CreateUserCommand extends Command
{
    protected $signature = 'access:user-create
        {name : The name the user is shown by}
        {email : The address the user signs in with}';

    protected $description = 'Create a user account with its own desk; the password is asked for';

    public function handle(CreateNewUser $users): int
    {
        $password = (string) $this->secret('Password');

        $user = $users->create([
            'name' => (string) $this->argument('name'),
            'email' => (string) $this->argument('email'),
            'password' => $password,
            'password_confirmation' => $password,
        ]);

        $this->info("Created user {$user->id}.");

        return self::SUCCESS;
    }
}
