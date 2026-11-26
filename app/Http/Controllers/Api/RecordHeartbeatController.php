<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Agents\Api\RecordHeartbeatPayload;
use App\Agents\Commands\RecordHeartbeat\RecordHeartbeatCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Support\AgentContext;
use App\Values\ApiAccepted;

/**
 * Records the calling session's heartbeat.
 */
final readonly class RecordHeartbeatController
{
    #[Dispatches(RecordHeartbeatCommand::class)]
    public function __invoke(RecordHeartbeatPayload $call, AgentContext $context, CommandBus $commands): ApiAccepted
    {
        $commands->run(new RecordHeartbeatCommand($context->sessionId));

        return new ApiAccepted();
    }
}
