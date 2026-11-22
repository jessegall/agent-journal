<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Why a merge of approved work left the target unchanged.
 */
enum MergeRefusalReason: string
{
    case Conflict = 'conflict';
    case ChangedReviewedHead = 'changed_reviewed_head';
    case OverlappingLocalChanges = 'overlapping_local_changes';
    case ChangedTarget = 'changed_target';

    /**
     * Whether the worker must repair its work before it can be merged.
     */
    public function needsRepair(): bool
    {
        return $this === self::Conflict;
    }
}
