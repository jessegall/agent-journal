<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\ActiveAccountReader;
use App\Models\Account;
use App\Models\ActiveAccount;
use App\Values\SelectedAccount;

/**
 * The account a start runs with: the saved selection locked first, then its account, or the account the owner chose,
 * which must accept starts either way.
 */
final readonly class ActiveAccountRecords implements ActiveAccountReader
{
    public function forStart(string $driver): SelectedAccount
    {
        return ActiveAccount::lockedAccountForStart($driver)->selectedForStart();
    }

    public function chosenForStart(string $driver, string $accountId, int $reviewedSignIn): SelectedAccount
    {
        return Account::lockedChosenForStart($driver, $accountId, $reviewedSignIn)->selectedForStart();
    }
}
