<?php

declare(strict_types=1);

namespace Domain\Access\Actions;

use App\Contracts\ActorProvisioning;
use App\Contracts\AssignmentTransaction;
use App\Support\ActorIdentity;
use Domain\Access\Concerns\PasswordValidationRules;
use Domain\Access\Models\User;
use Illuminate\Contracts\Validation\Factory as ValidationFactory;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

final class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    public function __construct(
        private readonly ValidationFactory $validation,
        private readonly AssignmentTransaction $assignments,
        private readonly ActorProvisioning $desks,
    ) {}

    /**
     * Validates and registers the user, then gives them their own desk, so they have an inbox from the start.
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

        return $this->assignments->run(function () use ($input): User {
            $user = User::create($input['name'], $input['email'], $input['password']);
            $this->desks->provision(ActorIdentity::of($user), $user->name);

            return $user;
        });
    }
}
