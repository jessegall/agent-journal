<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What a process does with the account it uses: the one process that owns the account's sign-in and refresh, one
 * execution or thread of a launch, or a tool that execution started. Each is stopped and acknowledged on its own.
 */
enum AccountProcessRole: string
{
    case AuthenticationOwner = 'authentication-owner';
    case Execution = 'execution';
    case ChildTool = 'child-tool';
}
