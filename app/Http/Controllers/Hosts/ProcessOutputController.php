<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hosts;

use App\Attributes\Bus\Dispatches;
use App\Commands\Hosts\NotifyHostOutput\NotifyHostOutputCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\HostContext;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Takes what one of the host's processes printed.
 */
final readonly class ProcessOutputController
{
    #[Dispatches(NotifyHostOutputCommand::class)]
    public function __invoke(string $process, Request $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new NotifyHostOutputCommand($host->hostId, $process, $request->getContent()));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
