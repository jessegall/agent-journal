<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Where a launch's program came from: the caller named it, its profile set it, or the parent session ran it.
 */
enum ProgramSourceType: string
{
    case Explicit = 'explicit';
    case Profile = 'profile';
    case ParentSession = 'parent_session';
}
