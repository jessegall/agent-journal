<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Stacks;

use App\Enums\FrameReuse;
use App\Support\States\AgentState;

/**
 * A test state of which the stack keeps one frame, whatever subject it is pushed for.
 */
final class SingleState extends AgentState
{
    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerType;
    }
}
