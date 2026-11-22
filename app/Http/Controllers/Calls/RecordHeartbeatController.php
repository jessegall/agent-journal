<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Agents\RecordHeartbeatCall;
use App\Commands\RecordHeartbeat\RecordHeartbeatCommand;
use App\Contracts\Bus\CommandBus;
use App\Support\AgentContext;
use App\Values\CallAccepted;

/**
 * Records the calling session's heartbeat.
 */
final readonly class RecordHeartbeatController
{
    public function __invoke(RecordHeartbeatCall $call, AgentContext $context, CommandBus $commands): CallAccepted
    {
        $commands->run(new RecordHeartbeatCommand($context->sessionId));

        return new CallAccepted();
    }
}
