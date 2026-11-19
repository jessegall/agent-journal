<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Hooks\Lifecycle\FrameLifecycle;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Values\Answer\PreparedCall;
use App\Hooks\Values\Answer\RestoredCall;
use App\Pipelines\Contracts\Pipe;
use Illuminate\Contracts\Container\Container;

/**
 * Restores the agent's stack from its locked row, once no lifecycle callback of this agent is running. The lifecycle
 * and the restorer hold request state, so both are asked for per call.
 */
final readonly class RestoreStack implements Pipe
{
    public function __construct(private Container $container) {}

    public function handle(PreparedCall $prepared): RestoredCall
    {
        $this->container->make(FrameLifecycle::class)->refuseChangeDuringCallbacks($prepared->call->target);

        return $prepared->restored($this->container->make(StackRestorer::class)->restore($prepared->row->frames));
    }
}
