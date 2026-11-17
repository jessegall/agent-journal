<?php

declare(strict_types=1);

namespace App\Domain\Access\Actions;

use App\Domain\Access\Concerns\PasswordValidationRules;
use App\Domain\Access\Models\User;
use Illuminate\Contracts\Validation\Factory as ValidationFactory;
use Laravel\Fortify\Contracts\ResetsUserPasswords;

class ResetUserPassword implements ResetsUserPasswords
{
    use PasswordValidationRules;

    public function __construct(private readonly ValidationFactory $validation) {}

    /**
     * Validate and reset the user's forgotten password.
     *
     * @param  array<string, string>  $input
     */
    public function reset(User $user, array $input): void
    {
        $this->validation->make($input, [
            'password' => $this->passwordRules(),
        ])->validate();

        $user->changePassword($input['password']);
    }
}
