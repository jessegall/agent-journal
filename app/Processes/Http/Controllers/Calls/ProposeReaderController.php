<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ProposeReaderCall;
use App\Processes\Calls\ReaderProposed;
use App\Processes\Commands\ProposeReader;
use App\Processes\Values\ReaderDefinition;

/**
 * Proposes a draft reader for a held command.
 */
final readonly class ProposeReaderController
{
    public function __invoke(ProposeReaderCall $call, CommandBus $commands): ReaderProposed
    {
        $definition = ReaderDefinition::fromArray($call->definition);
        $command = new ProposeReader($call->commandRequest, $call->declarationRevision, $definition);

        return ReaderProposed::from(['readerRevisionId' => $commands->run($command), 'state' => 'draft']);
    }
}
