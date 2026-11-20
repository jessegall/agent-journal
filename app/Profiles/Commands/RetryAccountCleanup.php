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
use App\Profiles\Handlers\RetryAccountCleanupHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner asks the host to try a removed account's cleanup again after its tries ran out; the cleanup keeps its
 * generation and still waits until no process runs on the account.
 *
 * @extends Command<null>
 */
#[HandledBy(RetryAccountCleanupHandler::class)]
#[Operation('retry_account_cleanup', ResourceAreaType::JournalControl, AccessType::Edit)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
final readonly class RetryAccountCleanup extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $accountId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Account::class;
    }
}
