<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Whether a driver sees a changed skill set in a running session, or only in a new one.
 */
enum SkillReload: string
{
    case NewSession = 'new_session';
    case Live = 'live';
}
