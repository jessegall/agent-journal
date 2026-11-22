<?php

declare(strict_types=1);

namespace App\Contracts\Admission;

use App\Exceptions\MergeRefused;
use App\Support\ActorIdentity;
use App\Values\ApprovedHead;
use App\Values\ReviewDecisionReference;

/**
 * Admits the merge of reviewed work: only the current holder of its merge ask, at the version they read, may publish
 * the exact head a typed approval names.
 */
interface MergeAdmission
{
    /**
     * @throws MergeRefused
     */
    public function requireApproval(
        ActorIdentity $caller,
        ReviewDecisionReference $decision,
        int $expectedVersion,
    ): ApprovedHead;
}
