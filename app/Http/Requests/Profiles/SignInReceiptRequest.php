<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Profiles\Commands\BeginSignIn;
use App\Profiles\Commands\BeginSignInAgain;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner asks what became of one sign-in start under its request key: a new account's start names its driver,
 * a renewal names its account.
 */
final class SignInReceiptRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:128'],
            'driver' => ['required_without:account', 'prohibits:account', 'string', 'max:64'],
            'account' => ['required_without:driver', 'string', 'max:64'],
        ];
    }

    public function requestKey(): string
    {
        return $this->string('key')->toString();
    }

    public function isRenewal(): bool
    {
        return $this->filled('account');
    }

    /**
     * @return class-string
     */
    public function command(): string
    {
        return $this->isRenewal() ? BeginSignInAgain::class : BeginSignIn::class;
    }

    public function target(): string
    {
        return $this->isRenewal()
            ? BeginSignInAgain::targetOf($this->string('account')->toString())
            : BeginSignIn::targetOf($this->string('driver')->toString());
    }
}
