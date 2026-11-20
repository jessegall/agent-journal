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
use App\Profiles\Handlers\SwitchAccountHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner chooses the account new starts of its program use; starts already running keep theirs.
 *
 * @extends Command<null>
 */
#[HandledBy(SwitchAccountHandler::class)]
#[Operation('switch_account', ResourceAreaType::JournalControl, AccessType::Edit)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
final readonly class SwitchAccount extends Command implements HasAuthorizationSubject
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
