<?php

declare(strict_types=1);

namespace App\Hooks\Decisions\Contracts;

use App\Hooks\Stack\StateAnswer;

/**
 * A part of a state's answer to a hook that knows where it goes in that answer: a decision or a line for the agent.
 */
interface AnswerPart
{
    public function addTo(StateAnswer $answer): StateAnswer;
}
