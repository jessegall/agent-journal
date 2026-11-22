<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Authorization\OwnerPolicy;
use App\Models\Account;

/**
 * Who may read and manage the saved accounts: only the owner holds the accesses, so the grants decide.
 */
final readonly class AccountPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return Account::class;
    }
}
