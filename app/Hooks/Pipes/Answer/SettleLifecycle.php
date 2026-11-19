<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Hooks\Lifecycle\FrameLifecycle;
use App\Hooks\Values\Answer\SettledCall;
use App\Hooks\Values\Answer\WalkedCall;
use App\Pipelines\Contracts\Pipe;
use Illuminate\Contracts\Container\Container;

/**
 * Calls the lifecycle methods of the frames that left, arrived or came back on top. The lifecycle holds request
 * state, so it is asked for per call.
 */
final readonly class SettleLifecycle implements Pipe
{
    public function __construct(private Container $container) {}

    public function handle(WalkedCall $walked): SettledCall
    {
        $this->container->make(FrameLifecycle::class)->settle(
            $walked->call->target,
            $walked->stackBefore,
            $walked->answer->stack,
        );

        return $walked->settled();
    }
}
