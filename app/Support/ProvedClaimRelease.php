<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\ClaimRelease;
use App\Contracts\Bus\CommandFacts;
use App\Events\Assignments\AssignmentsEnded;
use App\Models\Records\AssignmentRecord;

/**
 * Removes the claims proved by a lost assignment with one set delete, and tells which claims ended.
 */
final readonly class ProvedClaimRelease implements ClaimRelease
{
    public function __construct(private CommandFacts $facts) {}

    public function releaseAuthorizedBy(AssignmentReference $source): void
    {
        $claimIds = AssignmentRecord::claimIdsProvedBy($source);

        if ($claimIds === []) {
            return;
        }

        AssignmentRecord::claimsProvedBy($source)->delete();
        $this->facts->publishAfterCommit(new AssignmentsEnded($claimIds));
    }
}
