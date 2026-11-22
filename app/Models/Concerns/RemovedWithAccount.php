<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use App\Models\Support\AccountOwnerScope;
use App\Support\ReadBuilder;

/**
 * A usage row of a saved account that goes when the account's removal finishes, one row at a time.
 */
trait RemovedWithAccount
{
    /**
     * The usage rows of the account, for the journal whoever acts.
     *
     * @return ReadBuilder<self>
     */
    public static function ofAccount(string $accountId): ReadBuilder
    {
        return self::query()->withoutGlobalScope(AccountOwnerScope::class)->where('account_id', $accountId);
    }

    /**
     * Deletes this row of an account whose removal finished.
     */
    public function forget(): void
    {
        $this->delete();
    }
}
