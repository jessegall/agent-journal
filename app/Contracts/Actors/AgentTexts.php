<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Exceptions\AgentTextUnknown;
use App\Exceptions\AgentTextValuesMismatch;
use App\Values\AgentText;

/**
 * Writes agent texts out in words, where a text reaches an agent's context.
 */
interface AgentTexts
{
    /**
     * The text in the agent's words, its placeholders filled; an unknown key or a value missing or left over fails.
     *
     * @throws AgentTextUnknown
     * @throws AgentTextValuesMismatch
     */
    public function render(AgentText $text): string;
}
