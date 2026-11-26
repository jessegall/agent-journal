<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hosts;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Hosts\Values\HostContext;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Takes what a host holds once it started.
 */
final readonly class InventoryController
{
    #[Dispatches(NotifyHostInventoryCommand::class)]
    public function __invoke(Request $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new NotifyHostInventoryCommand($host->hostId, $request->getContent()));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
