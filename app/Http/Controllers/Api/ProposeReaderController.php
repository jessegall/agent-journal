<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ProposeReaderPayload;
use App\Api\Processes\ReaderProposed;
use App\Commands\CommandRules\ProposeReader\ProposeReaderCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Proposes a draft reader for a held command.
 */
final readonly class ProposeReaderController
{
    public function __invoke(ProposeReaderPayload $call, CommandBus $commands): ReaderProposed
    {
        $command = new ProposeReaderCommand($call->commandRequest, $call->declarationRevision, $call->definition);

        return ReaderProposed::from([
            'readerRevisionId' => $commands->run($command),
            'state' => 'draft',
        ]);
    }
}
