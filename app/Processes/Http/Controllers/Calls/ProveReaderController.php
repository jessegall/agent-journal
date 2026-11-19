<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ProveReaderCall;
use App\Processes\Calls\ReaderProofStarted;
use App\Processes\Commands\ProveReader;

/**
 * Proves a reader over sample runs and answers its proof.
 */
final readonly class ProveReaderController
{
    public function __invoke(ProveReaderCall $call, CommandBus $commands): ReaderProofStarted
    {
        $proofId = $commands->run(new ProveReader($call->commandRequest, $call->readerRevision, $call->runs));

        return ReaderProofStarted::from(['proofId' => $proofId, 'state' => 'awaiting_approval']);
    }
}
