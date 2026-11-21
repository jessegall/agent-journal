<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Values\SelectedAccount;
use App\Profiles\Models\ActiveAccount;
use App\Programs\Enums\HookProgram;

/**
 * The account a start runs with, read from the saved selection: the selection locked first, then the account, which
 * must accept starts.
 */
final readonly class ActiveAccountRecords implements ActiveAccountReader
{
    public function forStart(HookProgram $program): SelectedAccount
    {
        return ActiveAccount::lockedAccountForStart($program)->selectedForStart();
    }
}
