<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ProveReaderPayload;
use App\Api\Processes\ReaderProofStarted;
use App\Attributes\Bus\Dispatches;
use App\Commands\CommandRules\ProveReader\ProveReaderCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Proves a reader over sample runs and answers its proof.
 */
final readonly class ProveReaderController
{
    #[Dispatches(ProveReaderCommand::class)]
    public function __invoke(ProveReaderPayload $call, CommandBus $commands): ReaderProofStarted
    {
        $proofId = $commands->run(new ProveReaderCommand($call->commandRequest, $call->readerRevision, $call->runs));

        return ReaderProofStarted::from([
            'proofId' => $proofId,
            'state' => 'awaiting_approval',
        ]);
    }
}
