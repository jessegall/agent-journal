<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use App\Models\Accounts\Account;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * A usage row kept per sign-in of its account: the scope that reads the rows of one sign-in generation.
 */
trait OfSignIn
{
    /**
     * The rows of the account's sign-in generation.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function ofSignIn(Builder $query, Account $account, int $generation): void
    {
        $query->where('account_id', $account->id)->where('sign_in_generation', $generation);
    }
}
