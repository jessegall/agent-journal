<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Profiles\Enums\AccountAbility;
use App\Profiles\Handlers\BeginSignInHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;
use App\Profiles\Values\SignInStarted;

/**
 * The owner starts signing in a new account of a program under a name; a saved account is signed in again with
 * BeginSignInAgain. A repeat of the same request, or a second start while one runs, rejoins the attempt running.
 *
 * @extends Command<SignInStarted>
 */
#[HandledBy(BeginSignInHandler::class)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
final readonly class BeginSignIn extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $program,
        public string $requestKey,
        public string $label,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Account::class;
    }
}
