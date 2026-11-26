<?php

declare(strict_types=1);

namespace App\Stacks\Contracts\Work;

use App\Support\RecordIdentity;

/**
 * A state an agent's stack holds one frame of per subject: a push of its type for the same subject finds that frame.
 */
interface UniqueSubjectState
{
    /**
     * The record the state is about, such as its task: two frames of its type about the same record are one.
     */
    public function stateSubject(): RecordIdentity;
}
