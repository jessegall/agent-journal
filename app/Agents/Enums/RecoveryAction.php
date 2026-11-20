<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What a user did to a driver request that went wrong or waits on them (doc 40 revision 3, section 20).
 */
enum RecoveryAction: string
{
    case Retried = 'retried';
    case Cancelled = 'cancelled';
    case ResolvedApplied = 'resolved_applied';
    case ResolvedNotApplied = 'resolved_not_applied';
    case Repaired = 'repaired';
    case ScriptResumed = 'script_resumed';
    case ScriptCancelled = 'script_cancelled';
}
