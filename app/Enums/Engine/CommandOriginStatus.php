<?php

declare(strict_types=1);

namespace App\Enums\Engine;

/**
 * The result of checking an effect's origin in the command transaction.
 */
enum CommandOriginStatus: string
{
    case Eligible = 'eligible';
    case Stale = 'stale';
    case TargetUnavailable = 'target_unavailable';
}
