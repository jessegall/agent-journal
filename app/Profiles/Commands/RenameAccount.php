<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Profiles\Enums\AccountAbility;
use App\Profiles\Handlers\RenameAccountHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner gives a saved account a new name; past starts show the new name too.
 *
 * @extends Command<null>
 */
#[HandledBy(RenameAccountHandler::class)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
final readonly class RenameAccount extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $accountId,
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
