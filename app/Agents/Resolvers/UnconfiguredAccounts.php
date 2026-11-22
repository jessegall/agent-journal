<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Enums\StartUnavailableReason;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Values\SelectedAccount;

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
