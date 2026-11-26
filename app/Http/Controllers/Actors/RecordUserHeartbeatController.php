<?php

declare(strict_types=1);

namespace App\Http\Controllers\Actors;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Sessions\Commands\RecordUserHeartbeat\RecordUserHeartbeatCommand;
use Illuminate\Http\Response;

/**
 * Records the signed-in user's heartbeat from an open viewer; the server takes the user and the time.
 */
final readonly class RecordUserHeartbeatController
{
    #[Dispatches(RecordUserHeartbeatCommand::class)]
    public function __invoke(CommandBus $commands): Response
    {
        $commands->run(new RecordUserHeartbeatCommand());

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
