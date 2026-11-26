<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hosts;

use App\Attributes\Bus\Dispatches;
use App\Commands\Hosts\NotifyHostOrder\NotifyHostOrderCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\HostContext;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Takes the host's answer to an order it claimed.
 */
final readonly class AnswerOrderController
{
    #[Dispatches(NotifyHostOrderCommand::class)]
    public function __invoke(string $order, Request $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new NotifyHostOrderCommand($host->hostId, $order, $request->getContent()));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
