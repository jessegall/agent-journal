<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\AssignmentReference;

/**
 * Ends every claim that stands on one lost seat or work assignment, in the caller's transaction.
 */
interface ClaimRelease
{
    /**
     * Ends every claim that the source assignment authorized, once that assignment ends.
     */
    public function releaseAuthorizedBy(AssignmentReference $source): void;
}
