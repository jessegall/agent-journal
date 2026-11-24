<?php

declare(strict_types=1);

namespace App\Events\Hooks;

use App\Support\Inputs\Values\ToolResult;
use App\Values\StackTarget;

/**
 * An agent's tool call finished, raised inside the hook call after the replay check: listeners record what the call
 * proves, such as a full read of a file, and change nothing about the answer.
 */
final readonly class ToolCallFinished extends HookEvent
{
    public function __construct(
        public StackTarget $target,
        public ToolResult $finishedTool,
    ) {}
}
