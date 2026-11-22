<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Values\SelectedAccount;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;

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
