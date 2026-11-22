<?php

declare(strict_types=1);

namespace App\Support\Decisions;

use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\Stack\StateAnswer;

/**
 * A line a state adds to the agent's context with its answer to a hook.
 */
final readonly class ContextLine implements AnswerPart
{
    public function __construct(public string $text) {}

    public function addTo(StateAnswer $answer): StateAnswer
    {
        return $answer->withLine($this);
    }
}
