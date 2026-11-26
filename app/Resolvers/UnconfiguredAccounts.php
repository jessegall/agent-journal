<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Accounts\Contracts\ActiveAccountReader;
use App\Accounts\Exceptions\AccountUnavailable;
use App\Sessions\Enums\StartUnavailableReason;
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
