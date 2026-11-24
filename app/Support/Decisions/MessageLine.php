<?php

declare(strict_types=1);

namespace App\Support\Decisions;

use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\Stack\StateAnswer;
use App\Values\AgentText;

/**
 * A line a state adds to the agent's context that also wakes the agent when the hook leaves it idle, and is kept for
 * its next hook.
 */
final readonly class MessageLine implements AnswerPart
{
    public function __construct(public AgentText $text) {}

    public function addTo(StateAnswer $answer): StateAnswer
    {
        return $answer->withLine($this);
    }
}
