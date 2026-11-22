<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actor;
use App\Contracts\CurrentAuthorizer;
use App\Contracts\VisibilityCheck;
use App\Enums\AccessType;
use App\Models\Account;
use App\Policies\AccountPolicy;

/**
 * Shows the Accounts page and its actions to an actor granted the account read, which only the owner holds.
 */
final readonly class AccountOwnerCheck implements VisibilityCheck
{
    public function __construct(private CurrentAuthorizer $authorizer) {}

    public function allows(Actor $actor): bool
    {
        return $this->authorizer->filterActions(AccountPolicy::class, Account::class, [AccessType::Read]) !== [];
    }
}
