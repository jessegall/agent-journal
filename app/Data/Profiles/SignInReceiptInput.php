<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Exceptions\SignInReceiptUnnamed;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The owner asks what became of one sign-in start under its request key: a new account's start names its driver,
 * a renewal names its account.
 */
#[TypeScript]
final class SignInReceiptInput extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string|Optional $driver,
        public readonly string|Optional $account,
    ) {}

    /**
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'key' => [
                'required',
                'string',
                'max:128',
            ],
            'driver' => [
                'required_without:account',
                'prohibits:account',
                'string',
                'max:64',
            ],
            'account' => [
                'required_without:driver',
                'string',
                'max:64',
            ],
        ];
    }

    public function isRenewal(): bool
    {
        return is_string($this->account);
    }

    /**
     * @return class-string
     */
    public function command(): string
    {
        if ($this->isRenewal()) {
            return BeginSignInAgainCommand::class;
        }

        return BeginSignInCommand::class;
    }

    public function target(): string
    {
        return match (true) {
            is_string($this->account) => BeginSignInAgainCommand::targetOf($this->account),
            is_string($this->driver) => BeginSignInCommand::targetOf($this->driver),
            default => throw SignInReceiptUnnamed::for($this->key),
        };
    }
}
