<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Decisions\StateReference;

/**
 * A record an actor works on through a frame on its stack, such as a task or a question it must answer. The record
 * names only the state it is worked under; the stacks holding that state are found when its work ends.
 */
interface WorkedOnStack
{
    /**
     * The state a frame holds while the record is worked on, for its current run.
     */
    public function workState(): StateReference;
}
