<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Commands\ReadHostFolderAnswer\ReadHostFolderAnswerCommand;
use App\Hosts\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Tells the host's runner where its account folder instruction stands. The host's calls run as the journal itself.
 */
final readonly class ReadHostFolderAnswerController
{
    #[Dispatches(ReadHostFolderAnswerCommand::class)]
    public function __invoke(string $instruction, HostContext $host, CommandBus $commands): JsonResponse
    {
        $answer = $commands->run(new ReadHostFolderAnswerCommand($host->hostId, $instruction));

        return new JsonResponse(
            ['status' => $answer->status->value, 'reason' => $answer->reason, 'is_bound' => $answer->isBound],
            headers: ['Cache-Control' => 'no-store'],
        );
    }
}
