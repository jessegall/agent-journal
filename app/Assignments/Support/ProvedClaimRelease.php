<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Contracts\ClaimRelease;
use App\Assignments\Models\AssignmentRecord;

/**
 * Removes the claims proved by a lost assignment with one set delete.
 */
final readonly class ProvedClaimRelease implements ClaimRelease
{
    public function releaseAuthorizedBy(AssignmentReference $source): void
    {
        AssignmentRecord::claimsProvedBy($source)->delete();
    }
}
