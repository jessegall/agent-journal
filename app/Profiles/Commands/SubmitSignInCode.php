<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Profiles\Enums\AccountAbility;
use App\Profiles\Handlers\SubmitSignInCodeHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner types the code the provider's page showed into a live sign-in; the host's runner hands it to the
 * program once. The code is never stored with the attempt.
 *
 * @extends Command<null>
 */
#[HandledBy(SubmitSignInCodeHandler::class)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
final readonly class SubmitSignInCode extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $attemptId,
        public string $code,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Account::class;
    }
}
