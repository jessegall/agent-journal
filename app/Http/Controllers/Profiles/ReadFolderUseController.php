<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Commands\ReadFolderUse\ReadFolderUseCommand;
use App\Hosts\Values\HostContext;
use App\Http\Requests\Profiles\HostFolderRequest;
use Illuminate\Http\JsonResponse;

/**
 * Orders the host to say whether a container still binds the runner's account folder. The host's calls run as the journal itself.
 */
final readonly class ReadFolderUseController
{
    #[Dispatches(ReadFolderUseCommand::class)]
    public function __invoke(HostFolderRequest $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $instructionId = $commands->run(new ReadFolderUseCommand($host->hostId, $request->folder(), $request->operation()));

        return new JsonResponse(['instruction_id' => $instructionId], JsonResponse::HTTP_ACCEPTED);
    }
}
