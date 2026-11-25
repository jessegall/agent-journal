<?php

declare(strict_types=1);

namespace App\Commands\Accounts\BeginSignIn;

use App\Attributes\Authorize;
use App\Attributes\RetainedActorRequestKey;
use App\Contracts\Bus\TargetedCommand;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Agents\AccessType;
use App\Policies\AccountPolicy;
use App\Support\Command;
use App\Values\SignInStarted;

/**
 * The owner starts signing in a new account of a driver, named once it proves who it is; a saved account is signed
 * in again with BeginSignInAgain. A second start while one runs rejoins the attempt running; the owner's request key
 * keeps its receipt, so a repeat answers the same attempt and a key used for another start is refused.
 *
 * @extends Command<SignInStarted>
 */
#[RetainedActorRequestKey(answerDays: 30)]
#[Authorize(AccountPolicy::class, AccessType::Create)]
final readonly class BeginSignInCommand extends Command implements TargetedCommand
{
    public function __construct(
        public string $driver,
        public SignInMethod $method,
    ) {}

    /**
     * The receipt is for the driver whose new account it signs in.
     */
    public static function targetOf(string $driver): string
    {
        return "add:{$driver}";
    }

    public function receiptTarget(): string
    {
        return self::targetOf($this->driver);
    }
}
