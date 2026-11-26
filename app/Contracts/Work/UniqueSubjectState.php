<?php

declare(strict_types=1);

namespace App\Contracts\Work;

/**
 * A state an agent's stack holds one frame of per subject: a push of its type for the same subject finds that frame.
 */
interface UniqueSubjectState
{
    /**
     * The key of what the state is about, such as a task's id: two frames of its type with the same key are one.
     */
    public function stateSubject(): string;
}
