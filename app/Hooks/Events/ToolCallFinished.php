<?php

declare(strict_types=1);

namespace App\Hooks\Events;

use App\Agents\Support\StackTarget;
use App\Contracts\Event;
use App\Hooks\Inputs\ToolResult;

/**
 * An agent's tool call finished, raised inside the hook call after the replay check: listeners record what the call
 * proves, such as a full read of a file, and change nothing about the answer.
 */
final readonly class ToolCallFinished implements Event
{
    public function __construct(
        public StackTarget $target,
        public ToolResult $finishedTool,
    ) {}
}
