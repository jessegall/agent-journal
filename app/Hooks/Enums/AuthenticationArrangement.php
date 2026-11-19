<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * How launches on one account share its sign-in: each launch runs its own program process on the account's store,
 * or one process owns the sign-in and its refresh and runs each launch as a thread of its own.
 */
enum AuthenticationArrangement: string
{
    case DirectProcesses = 'direct-processes';
    case SharedOwner = 'shared-owner';
}
