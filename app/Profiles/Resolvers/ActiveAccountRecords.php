<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Enums\StartUnavailableReason;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Support\SelectedAccount;
use App\Profiles\Models\ActiveAccount;
use App\Programs\Enums\HookProgram;

/**
 * The account a start runs with, read from the saved selection: the selection locked first, then the account, which
 * must accept starts. A program the journal does not run has no account.
 */
final readonly class ActiveAccountRecords implements ActiveAccountReader
{
    public function forStart(string $program): SelectedAccount
    {
        $hookProgram = HookProgram::tryFrom($program);

        if ($hookProgram === null) {
            throw AccountUnavailable::forStart($program, StartUnavailableReason::NoAccount);
        }

        return ActiveAccount::lockedAccountForStart($hookProgram)->selectedForStart();
    }
}
