<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hosts;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Commands\NotifyHostOrder\NotifyHostOrderCommand;
use App\Hosts\Values\HostContext;
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
