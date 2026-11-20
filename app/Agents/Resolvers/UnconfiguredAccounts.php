<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Enums\StartUnavailableReason;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Support\SelectedAccount;
use App\Programs\Enums\HookProgram;

/**
 * The account reader while nothing keeps accounts: every start is refused for want of one, never run on a guess.
 */
final readonly class UnconfiguredAccounts implements ActiveAccountReader
{
    public function forStart(HookProgram $program): SelectedAccount
    {
        throw AccountUnavailable::forStart($program->value, StartUnavailableReason::NoAccount);
    }
}
