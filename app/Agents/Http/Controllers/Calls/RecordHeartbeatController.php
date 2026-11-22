<?php

declare(strict_types=1);

namespace App\Agents\Http\Controllers\Calls;

use App\AgentRequests\Values\CallAccepted;
use App\Agents\Calls\RecordHeartbeatCall;
use App\Agents\Commands\RecordHeartbeat\RecordHeartbeatCommand;
use App\Agents\Support\AgentContext;
use App\Bus\Contracts\CommandBus;

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
