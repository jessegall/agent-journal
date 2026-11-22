<?php

declare(strict_types=1);

namespace Domain\Plans\Enums;

/**
 * Where a review edition stands: asked for, approved, sent back with changes requested, or withdrawn.
 */
enum PlanReviewState: string
{
    case Requested = 'requested';
    case Approved = 'approved';
    case ChangesRequested = 'changes_requested';
    case Withdrawn = 'withdrawn';
}
