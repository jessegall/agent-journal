<?php

declare(strict_types=1);

namespace App\Http\Controllers\Actors;

use App\Bus\Contracts\CommandBus;
use App\Web\Commands\RecordUserHeartbeat\RecordUserHeartbeatCommand;
use Illuminate\Http\Response;

/**
 * Records the signed-in user's heartbeat from an open viewer; the server takes the user and the time.
 */
final readonly class RecordUserHeartbeatController
{
    public function __invoke(CommandBus $commands): Response
    {
        $commands->run(new RecordUserHeartbeatCommand());

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
