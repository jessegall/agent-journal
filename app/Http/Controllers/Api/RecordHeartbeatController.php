<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Agents\RecordHeartbeatPayload;
use App\Commands\Agents\RecordHeartbeat\RecordHeartbeatCommand;
use App\Contracts\Bus\CommandBus;
use App\Support\AgentContext;
use App\Values\ApiAccepted;

/**
 * Records the calling session's heartbeat.
 */
final readonly class RecordHeartbeatController
{
    public function __invoke(RecordHeartbeatPayload $call, AgentContext $context, CommandBus $commands): ApiAccepted
    {
        $commands->run(new RecordHeartbeatCommand($context->sessionId));

        return new ApiAccepted();
    }
}
