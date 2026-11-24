<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\ProveReaderCall;
use App\Calls\Processes\ReaderProofStarted;
use App\Commands\CommandRules\ProveReader\ProveReaderCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Proves a reader over sample runs and answers its proof.
 */
final readonly class ProveReaderController
{
    public function __invoke(ProveReaderCall $call, CommandBus $commands): ReaderProofStarted
    {
        $proofId = $commands->run(new ProveReaderCommand($call->commandRequest, $call->readerRevision, $call->runs));

        return ReaderProofStarted::from(['proofId' => $proofId, 'state' => 'awaiting_approval']);
    }
}
