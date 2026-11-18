<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Support\StackTarget;
use PhpOption\Option;

/**
 * A record an agent works on through a frame on its stack, such as a task or a question it must answer.
 */
interface WorkedOnStack
{
    /**
     * The stack the record is worked on; none while no agent works on it.
     *
     * @return Option<StackTarget>
     */
    public function workTarget(): Option;
}
