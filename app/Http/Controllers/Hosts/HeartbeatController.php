<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hosts;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Commands\NotifyHostHeartbeat\NotifyHostHeartbeatCommand;
use App\Hosts\Values\HostContext;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Takes a host's heartbeat: the processes it still runs and the newest order it answered.
 */
final readonly class HeartbeatController
{
    #[Dispatches(NotifyHostHeartbeatCommand::class)]
    public function __invoke(Request $request, HostContext $host, CommandBus $commands): Response
    {
        $request->validate([
            'live_processes' => ['present', 'array'],
            'live_processes.*' => ['string'],
            'answered_through' => ['sometimes', 'nullable', 'string'],
        ]);

        /**
         * @var list<string> $live
         */
        $live = array_values($request->array('live_processes'));
        $answeredThrough = $request->filled('answered_through') ? $request->string('answered_through')->value() : null;
        $commands->run(new NotifyHostHeartbeatCommand($host->hostId, $live, $answeredThrough));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
