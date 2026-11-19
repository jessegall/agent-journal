<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Profiles\Enums\AccountAbility;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;
use App\Ui\Contracts\VisibilityCheck;

/**
 * Shows the Accounts page and its actions to an actor granted the account read, which only the owner holds.
 */
final readonly class AccountOwnerCheck implements VisibilityCheck
{
    public function __construct(private CurrentAuthorizer $authorizer) {}

    public function allows(Actor $actor): bool
    {
        return $this->authorizer->filterActions(AccountPolicy::class, Account::class, [AccountAbility::Read]) !== [];
    }
}
