<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Enums\LaunchUnavailableReason;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Support\SelectedAccount;

/**
 * The account reader while nothing keeps accounts: every launch is refused for want of one, never run on a guess.
 */
final readonly class UnconfiguredAccounts implements ActiveAccountReader
{
    public function forLaunch(string $program): SelectedAccount
    {
        throw AccountUnavailable::forLaunch($program, LaunchUnavailableReason::NoAccount);
    }
}
