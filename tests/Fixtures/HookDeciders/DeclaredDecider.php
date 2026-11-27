<?php

declare(strict_types=1);

namespace Tests\Fixtures\HookDeciders;

use App\Hooks\Contracts\HookDecider;
use App\Stacks\Decisions\MessageLine;
use App\Values\AgentText;

/**
 * Answers with a line as a HookDecider, which the hook answer test lets through.
 */
final class DeclaredDecider implements HookDecider
{
    public function line(): MessageLine
    {
        return new MessageLine(AgentText::of('core.stop.checks_running'));
    }
}
