<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Admission\MergeAdmission;
use App\Exceptions\MergeRefused;
use App\Values\ApprovedHead;
use App\Values\ReviewDecisionReference;

/**
 * Without supervision no review approves anything, so every merge is refused.
 */
final readonly class UnavailableMergeAdmission implements MergeAdmission
{
    public function requireApproval(
        ActorIdentity $caller,
        ReviewDecisionReference $decision,
        int $expectedVersion,
    ): ApprovedHead {
        throw MergeRefused::unavailable();
    }
}
