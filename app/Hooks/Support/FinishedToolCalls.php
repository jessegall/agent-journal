<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Values\StackTarget;
use App\Hooks\Events\ToolCallFinished;
use App\Hooks\Inputs\Contracts\HookInput;
use App\Hooks\Inputs\ToolFinished;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Tells the other areas that an agent's tool call finished, in the hook transaction after the replay check, so a
 * replayed call is told once only.
 */
final readonly class FinishedToolCalls
{
    public function __construct(
        private Dispatcher $events,
    ) {}

    public function announce(StackTarget $target, HookInput $input): void
    {
        if (! $input instanceof ToolFinished) {
            return;
        }

        $this->events->dispatch(new ToolCallFinished($target, $input->finishedTool));
    }
}
