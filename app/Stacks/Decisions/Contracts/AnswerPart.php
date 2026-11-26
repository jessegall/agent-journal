<?php

declare(strict_types=1);

namespace App\Stacks\Decisions\Contracts;

use App\Stacks\StateAnswer;

/**
 * A part of a state's answer to a hook that knows where it goes in that answer: a decision or a line for the agent.
 */
interface AnswerPart
{
    /**
     * The state's answer with this part added.
     */
    public function addTo(StateAnswer $answer): StateAnswer;
}
