<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Accounts\Enums\SignInMethod;
use App\Accounts\Enums\SignInStatus;
use App\Accounts\Enums\SignInType;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One sign-in as its owner sees it: its driver, the account it names, its state and deadline, the account it made or
 * renewed, whether that account lacks the provider's identity, whether a renewal waits for running agents, and the
 * provider's reason for a refusal. Never its folder, process or challenge.
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
        public readonly SignInStatus $status,
        public readonly bool $isAwaitingSignIn,
        public readonly string $expiresAt,
        public readonly string|null $refusal,
    ) {}

    public static function fromAttempt(SignInAttempt $attempt): self
    {
        return new self(
            $attempt->id,
            $attempt->account_protocol,
            $attempt->method,
            $attempt->type,
            $attempt->account_id,
            $attempt->resultAccount?->id,
            $attempt->isWaitingForAgents(),
            $attempt->isUnclaimedSince(CarbonImmutable::now()),
            $attempt->status,
            $attempt->status->isAwaitingSignIn(),
            $attempt->expires_at->toIso8601String(),
            $attempt->refusal,
        );
    }
}
