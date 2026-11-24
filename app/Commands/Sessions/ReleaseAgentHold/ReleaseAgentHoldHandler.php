<?php

declare(strict_types=1);

namespace App\Commands\Sessions\ReleaseAgentHold;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\Sessions\AgentHoldReleased;
use App\Exceptions\DriverRequestRefused;
use App\Support\ActorIdentity;
use App\Support\DriverRequests;

final readonly class ReleaseAgentHoldHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private CommandFacts $facts,
    ) {}

    public function handle(ReleaseAgentHoldCommand $command): void
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

        $this->facts->publishAfterCommit(
            new AgentHoldReleased($runtime->id, $command->expectedHold, $actor, $command->reason),
        );
    }
}
