<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ProposeReaderPayload;
use App\Api\Processes\ReaderProposed;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\ProposeReader\ProposeReaderCommand;

/**
 * Proposes a draft reader for a held command.
 */
final readonly class ProposeReaderController
{
    #[Dispatches(ProposeReaderCommand::class)]
    public function __invoke(ProposeReaderPayload $call, CommandBus $commands): ReaderProposed
    {
        $command = new ProposeReaderCommand($call->commandRequest, $call->declarationRevision, $call->definition);

        return ReaderProposed::from(['readerRevisionId' => $commands->run($command), 'state' => 'draft']);
    }
}
