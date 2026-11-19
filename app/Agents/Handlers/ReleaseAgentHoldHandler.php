<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\ReleaseAgentHold;
use App\Agents\Events\AgentHoldReleased;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Support\DriverRequests;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class ReleaseAgentHoldHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private Dispatcher $events,
    ) {}

    public function handle(ReleaseAgentHold $command): void
    {
        $target = $command->target();
        $runtime = $this->requests->runtimeOf($target);

        if (! $runtime->isHeldFor($command->expectedHold)) {
            throw DriverRequestRefused::holdChanged(
                $target,
                $command->expectedHold->value,
                $runtime->hold_reason->value,
            );
        }

        if (! $runtime->canReleaseHold()) {
            throw DriverRequestRefused::holdNotReleasable($target, $runtime->hold_reason->value);
        }

        $runtime->releaseHold();
        $actor = ActorIdentity::of($command->dispatchedBy());
        $this->events->dispatch(new AgentHoldReleased($runtime->id, $command->expectedHold, $actor, $command->reason));
    }
}
