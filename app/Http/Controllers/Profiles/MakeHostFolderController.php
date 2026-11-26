<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Commands\MakeHostFolder\MakeHostFolderCommand;
use App\Hosts\Values\HostContext;
use App\Http\Requests\Profiles\HostFolderRequest;
use Illuminate\Http\JsonResponse;

/**
 * Orders the host to make the runner's account folder. The host's calls run as the journal itself.
 */
final readonly class MakeHostFolderController
{
    #[Dispatches(MakeHostFolderCommand::class)]
    public function __invoke(HostFolderRequest $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $orderId = $commands->run(new MakeHostFolderCommand($host->hostId, $request->folder(), $request->operation()));

        return new JsonResponse(['order_id' => $orderId], JsonResponse::HTTP_ACCEPTED);
    }
}
