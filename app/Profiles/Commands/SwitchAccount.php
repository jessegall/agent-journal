<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Profiles\Enums\AccountAbility;
use App\Profiles\Handlers\SwitchAccountHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner chooses the account new launches of its program use; launches already running keep theirs.
 *
 * @implements Command<null>
 */
#[HandledBy(SwitchAccountHandler::class)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
final readonly class SwitchAccount implements Command, HasAuthorizationSubject
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
