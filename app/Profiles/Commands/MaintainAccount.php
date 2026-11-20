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
use App\Profiles\Handlers\MaintainAccountHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner holds an account before its sign-in is changed or removed: from this commit on no start selects it and
 * no new start of it is registered. Holding it again changes nothing.
 *
 * @extends Command<null>
 */
#[HandledBy(MaintainAccountHandler::class)]
#[Operation('maintain_account', ResourceAreaType::JournalControl, AccessType::Edit)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
final readonly class MaintainAccount extends Command implements HasAuthorizationSubject
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
