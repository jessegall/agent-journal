<?php

declare(strict_types=1);

namespace App\Commands\Accounts\BeginSignInAgain;

use App\Attributes\Authorize;
use App\Attributes\RetainedActorRequestKey;
use App\Contracts\Bus\TargetedCommand;
use App\Enums\Agents\AccessType;
use App\Policies\AccountPolicy;
use App\Support\Command;
use App\Values\SignInStarted;

/**
 * The owner confirms signing a saved account in again: no new start uses the account from then on, and the host
 * starts the driver's sign-in once every process on its folder has ended. A second start from another tab rejoins
 * the attempt already running; the owner's request key keeps its receipt, so a repeat answers the same attempt.
 *
 * @extends Command<SignInStarted>
 */
#[RetainedActorRequestKey(answerDays: 30)]
#[Authorize(AccountPolicy::class, AccessType::Create)]
final readonly class BeginSignInAgainCommand extends Command implements TargetedCommand
{
    public function __construct(
        public string $accountId,
    ) {}

    /**
     * The receipt is for the account it signs in again.
     */
    public static function targetOf(string $accountId): string
    {
        return "renew:{$accountId}";
    }

    public function receiptTarget(): string
    {
        return self::targetOf($this->accountId);
    }
}
