<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where the review of certified work stands: its commits still to import, open for its reviewer, approved, or
 * returned for repair.
 */
enum CodeReviewState: string
{
    case AwaitingImport = 'awaiting_import';
    case Open = 'open';
    case Approved = 'approved';
    case Returned = 'returned';
}
