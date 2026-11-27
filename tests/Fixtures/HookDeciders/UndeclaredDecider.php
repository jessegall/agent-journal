<?php

declare(strict_types=1);

namespace Tests\Fixtures\HookDeciders;

use App\Support\Decisions\Decision;
use App\Values\AgentText;

/**
 * Turns a stop into a refusal without being a HookDecider, which the hook answer test refuses.
 */
final class UndeclaredDecider
{
    public function refuse(): Decision
    {
        return Decision::deny(AgentText::of('core.stop.refused', ['conditions' => '']));
    }
}
