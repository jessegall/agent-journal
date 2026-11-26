<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\ProveReader\ProveReaderCommand;
use App\Processes\Api\ProveReaderPayload;
use App\Processes\Api\ReaderProofStarted;

/**
 * Proves a reader over sample runs and answers its proof.
 */
final readonly class ProveReaderController
{
    #[Dispatches(ProveReaderCommand::class)]
    public function __invoke(ProveReaderPayload $call, CommandBus $commands): ReaderProofStarted
    {
        $proofId = $commands->run(new ProveReaderCommand($call->commandRequest, $call->readerRevision, $call->runs));

        return ReaderProofStarted::from(['proofId' => $proofId, 'state' => 'awaiting_approval']);
    }
}
