<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Enums\LaunchUnavailableReason;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Support\SelectedAccount;
use App\Profiles\Models\ActiveAccount;
use App\Programs\Enums\HookProgram;

/**
 * The account a launch runs with, read from the saved selection: the selection locked first, then the account, which
 * must accept launches. A program the journal does not run has no account.
 */
final readonly class ActiveAccountRecords implements ActiveAccountReader
{
    public function forLaunch(string $program): SelectedAccount
    {
        $hookProgram = HookProgram::tryFrom($program);

        if ($hookProgram === null) {
            throw AccountUnavailable::forLaunch($program, LaunchUnavailableReason::NoAccount);
        }

        return ActiveAccount::lockedAccountForLaunch($hookProgram)->selectedForLaunch();
    }
}
