<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Agents\Exceptions\MergeRefused;
use App\Agents\Values\ApprovedHead;
use App\Agents\Values\ReviewDecisionReference;

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
