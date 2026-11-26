<?php

declare(strict_types=1);

namespace App\Accounts\Enums;

/**
 * How starts on one account share its sign-in: each start runs its own driver process on the account's store,
 * or one process owns the sign-in and its refresh and runs each start as a thread of its own.
 */
enum AuthenticationArrangement: string
{
    case DirectProcesses = 'direct-processes';
    case SharedOwner = 'shared-owner';
}
