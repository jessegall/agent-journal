<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\MergeAdmission;
use App\Agents\Exceptions\MergeRefused;
use App\Agents\Values\ApprovedHead;
use App\Agents\Values\ReviewDecisionReference;

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
