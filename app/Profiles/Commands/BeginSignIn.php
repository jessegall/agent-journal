<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\TargetedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Policies\AccountPolicy;
use App\Profiles\Values\SignInStarted;

/**
 * The owner starts signing in a new account of a program, named once it proves who it is; a saved account is signed
 * in again with BeginSignInAgain. A second start while one runs rejoins the attempt running; the owner's request key
 * keeps its receipt, so a repeat answers the same attempt and a key used for another start is refused.
 *
 * @extends Command<SignInStarted>
 */
#[RetainedActorRequestKey(answerDays: 30)]
#[Authorize(AccountPolicy::class, AccessType::Create)]
final readonly class BeginSignIn extends Command implements TargetedCommand
{
    public function __construct(
        public string $driver,
        public SignInMethod $method,
    ) {}

    /**
     * The receipt is for the program whose new account it signs in.
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
