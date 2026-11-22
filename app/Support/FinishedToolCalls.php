<?php

declare(strict_types=1);

namespace App\Support;

use App\Events\ToolCallFinished;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\ToolFinished;
use App\Values\StackTarget;
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
