<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Which commands a middleware acts on: all of them, one command, or one owner's commands.
 */
enum CommandScopeType: string
{
    case All = 'all';
    case Command = 'command';
    case Owner = 'owner';
}
