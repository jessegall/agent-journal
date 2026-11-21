<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Profiles\Enums\SignInMethod;
use App\Profiles\Enums\SignInState;
use App\Profiles\Enums\SignInType;
use App\Profiles\Models\SignInAttempt;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One sign-in as its owner sees it: its program, the name a new account gets or the account it signs in again, its
 * state and deadline, and the provider's reason when it refused the proof. Never its folder, its process or its challenge, which only the no-store read gives.
 */
#[TypeScript]
final class SignInAttemptData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $driver,
        public readonly SignInMethod $method,
        public readonly SignInType $type,
        public readonly string|null $accountId,
        public readonly SignInState $state,
        public readonly string $expiresAt,
        public readonly string|null $refusal,
    ) {}

    public static function fromAttempt(SignInAttempt $attempt): self
    {
        return new self(
            $attempt->id,
            $attempt->driver,
            $attempt->method,
            $attempt->type(),
            $attempt->account_id,
            $attempt->state,
            $attempt->expires_at->toIso8601String(),
            $attempt->refusal,
        );
    }
}
