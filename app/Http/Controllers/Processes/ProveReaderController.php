<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\ProveReaderRequest;
use App\Processes\Commands\ProveReader;
use Illuminate\Http\JsonResponse;

/**
 * Asks the journal to prove a request's draft reader against real sample runs.
 */
final readonly class ProveReaderController
{
    public function __invoke(ProveReaderRequest $request, string $commandRequest, CommandBus $commands): JsonResponse
    {
        $proofId = $commands->run(new ProveReader($commandRequest, $request->readerRevision(), $request->runIds()));

        return new JsonResponse(['proof_id' => $proofId, 'state' => 'awaiting_approval']);
    }
}
