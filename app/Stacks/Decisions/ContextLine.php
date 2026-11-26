<?php

declare(strict_types=1);

namespace App\Stacks\Decisions;

use App\Stacks\Decisions\Contracts\AnswerPart;
use App\Stacks\StateAnswer;
use App\Values\AgentText;

/**
 * A line a state adds to the agent's context with its answer to a hook.
 */
final readonly class ContextLine implements AnswerPart
{
    public function __construct(public AgentText $text) {}

    public function addTo(StateAnswer $answer): StateAnswer
    {
        return $answer->withLine($this);
    }
}
