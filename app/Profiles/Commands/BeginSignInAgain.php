<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Profiles\Enums\AccountAbility;
use App\Profiles\Handlers\BeginSignInAgainHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;
use App\Profiles\Values\SignInStarted;

/**
 * The owner confirms signing a saved account in again: no new start uses the account from then on, and the host
 * starts the program's sign-in once every process on its folder has ended. A repeat of the same request, or a second
 * start from another tab, rejoins the attempt already running.
 *
 * @extends Command<SignInStarted>
 */
#[HandledBy(BeginSignInAgainHandler::class)]
#[Operation('begin_sign_in_again', ResourceAreaType::JournalControl, AccessType::Create)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
final readonly class BeginSignInAgain extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $accountId,
        public string $requestKey,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Account::class;
    }
}
