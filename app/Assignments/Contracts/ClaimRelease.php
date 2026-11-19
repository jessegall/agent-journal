<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AssignmentReference;

/**
 * Ends every claim that stands on one lost seat or work assignment, in the caller's transaction.
 */
interface ClaimRelease
{
    public function releaseAuthorizedBy(AssignmentReference $source): void;
}
