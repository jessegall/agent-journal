<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Accounts\ActiveAccountReader;
use App\Enums\Starts\StartUnavailableReason;
use App\Exceptions\AccountUnavailable;
use App\Values\SelectedAccount;

/**
 * The account reader while nothing keeps accounts: every start is refused for want of one, never run on a guess.
 */
final readonly class UnconfiguredAccounts implements ActiveAccountReader
{
    public function forStart(string $driver): SelectedAccount
    {
        throw AccountUnavailable::forStart($driver, StartUnavailableReason::NoAccount);
    }

    public function chosenForStart(string $driver, string $accountId, int $reviewedSignIn): SelectedAccount
    {
        throw AccountUnavailable::forStart($driver, StartUnavailableReason::ChosenAccountMissing);
    }
}
