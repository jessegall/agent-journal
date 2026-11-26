<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Attributes\Bus\Dispatches;
use App\Commands\Hosts\RemoveHostFolder\RemoveHostFolderCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Profiles\HostFolderRequest;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Orders the host to remove the runner's account folder. The host's calls run as the journal itself.
 */
final readonly class RemoveHostFolderController
{
    #[Dispatches(RemoveHostFolderCommand::class)]
    public function __invoke(HostFolderRequest $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $orderId = $commands->run(new RemoveHostFolderCommand($host->hostId, $request->folder(), $request->operation()));

        return new JsonResponse(['order_id' => $orderId], JsonResponse::HTTP_ACCEPTED);
    }
}
