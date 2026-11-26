<?php

declare(strict_types=1);

namespace App\Assignments;

use App\Assignments\Contracts\ClaimRelease as ClaimReleaseContract;
use App\Bus\Contracts\CommandFacts;
use App\Events\Assignments\AssignmentsEnded;
use App\Models\Records\AssignmentRecord;
use App\Support\AssignmentReference;

/**
 * Removes the claims proved by a lost assignment with one set delete, and tells which claims ended.
 */
final readonly class ClaimRelease implements ClaimReleaseContract
{
    public function __construct(private CommandFacts $facts) {}

    public function releaseAuthorizedBy(AssignmentReference $source): void
    {
        $claimIds = AssignmentRecord::resolveClaimIdsProvedBy($source);

        if ($claimIds === []) {
            return;
        }

        AssignmentRecord::query()->claimsProvedBy($source)->delete();
        $this->facts->publishAfterCommit(new AssignmentsEnded($claimIds));
    }
}
