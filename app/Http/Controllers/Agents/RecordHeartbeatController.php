<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Support\AgentContext;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\Response;

/**
 * Records an explicit heartbeat of the calling session; the server takes the time, the body carries none.
 */
final readonly class RecordHeartbeatController
{
    public function __invoke(AgentContext $context, CommandBus $commands): Response
    {
        $commands->run(new RecordHeartbeat($context->sessionId));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
