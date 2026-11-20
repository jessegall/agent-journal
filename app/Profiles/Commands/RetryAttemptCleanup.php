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
use App\Profiles\Handlers\RetryAttemptCleanupHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner asks the host to try the cleanup of an unfinished new account's sign-in again, by the attempt alone, as
 * no account row exists for it.
 *
 * @extends Command<null>
 */
#[HandledBy(RetryAttemptCleanupHandler::class)]
#[Operation('retry_attempt_cleanup', ResourceAreaType::JournalControl, AccessType::Edit)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
final readonly class RetryAttemptCleanup extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $attemptId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Account::class;
    }
}
