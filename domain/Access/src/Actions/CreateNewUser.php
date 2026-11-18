<?php

declare(strict_types=1);

namespace Domain\Access\Actions;

use Domain\Access\Concerns\PasswordValidationRules;
use Domain\Access\Models\User;
use Illuminate\Contracts\Validation\Factory as ValidationFactory;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

final class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    public function __construct(private readonly ValidationFactory $validation) {}

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $this->validation->make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
            'password' => $this->passwordRules(),
        ])->validate();

        return User::register($input['name'], $input['email'], $input['password']);
    }
}
