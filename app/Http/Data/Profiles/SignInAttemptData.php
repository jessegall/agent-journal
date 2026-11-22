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
 * One sign-in as its owner sees it: its driver, the name a new account gets or the account it signs in again, its
 * state and deadline, the account it made, renewed or matched when the reader may read it, whether that account
 * lacks the provider's own identity so a later sign-in to it cannot be recognised, whether a renewal still waits for
 * the agents running on the account to finish, and the provider's reason
 * when it refused the proof. Never its folder, its process or its challenge, which only the no-store read gives.
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
        public readonly string|null $resultAccountId,
        public readonly bool $isResultUnmatchable,
        public readonly bool $isWaitingForAgents,
        public readonly SignInState $state,
        public readonly string $expiresAt,
        public readonly string|null $refusal,
    ) {}

    public static function fromAttempt(SignInAttempt $attempt): self
    {
        return new self(
            $attempt->id,
            $attempt->account_protocol,
            $attempt->method,
            $attempt->type(),
            $attempt->account_id,
            $attempt->resultAccount?->id,
            ! $attempt->method->isSecret() && $attempt->resultAccount?->lacksProviderIdentity() === true,
            $attempt->isWaitingForAgents(),
            $attempt->state,
            $attempt->expires_at->toIso8601String(),
            $attempt->refusal,
        );
    }
}
