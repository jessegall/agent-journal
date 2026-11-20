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
use App\Profiles\Handlers\RemoveAccountHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner removes a saved account: no start uses it again, no other account replaces it as the program's choice,
 * and the host signs it out and deletes its folder once its processes ended. Removing it again changes nothing.
 *
 * @extends Command<null>
 */
#[HandledBy(RemoveAccountHandler::class)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
#[Operation('remove_account', ResourceAreaType::JournalControl, AccessType::Delete)]
final readonly class RemoveAccount extends Command implements HasAuthorizationSubject
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
