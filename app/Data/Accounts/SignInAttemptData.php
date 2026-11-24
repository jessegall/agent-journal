<?php

declare(strict_types=1);

namespace App\Data\Accounts;

use App\Enums\SignInMethod;
use App\Enums\SignInState;
use App\Enums\SignInType;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;
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
        public readonly bool $isWaitingForAgents,
        public readonly bool $isUnclaimed,
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
            $attempt->isWaitingForAgents(),
            $attempt->isUnclaimedSince(CarbonImmutable::now()),
            $attempt->state,
            $attempt->expires_at->toIso8601String(),
            $attempt->refusal,
        );
    }
}
