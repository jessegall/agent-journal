<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelWrites\Models\Accounts;

use Illuminate\Database\Eloquent\Model;

/**
 * The shape of SignInAttempt::finish: it ends its own row, then frees the account's writer on the account's row.
 */
final class SignInAttempt extends Model
{
    public function finish(string $state): void
    {
        $this->state = $state;
        $this->save();

        if ($this->account_id !== null) {
            Account::lockedForJournal($this->account_id)->endSignInAgain($this);
        }
    }
}
