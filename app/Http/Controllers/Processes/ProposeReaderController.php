<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\ProposeReaderRequest;
use App\Processes\Commands\ProposeReader;
use Illuminate\Http\JsonResponse;

/**
 * Proposes a draft reader for a command request's declaration revision; the draft unlocks nothing.
 */
final readonly class ProposeReaderController
{
    public function __invoke(ProposeReaderRequest $request, string $commandRequest, CommandBus $commands): JsonResponse
    {
        $command = new ProposeReader($commandRequest, $request->declarationRevision(), $request->definition());

        return new JsonResponse(['reader_revision_id' => $commands->run($command), 'state' => 'draft']);
    }
}
