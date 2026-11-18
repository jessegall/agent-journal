<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\ProposeReaderHandler;
use App\Processes\Values\ReaderDefinition;

/**
 * An agent, or a user, proposes the reader for a request's declaration revision; it is stored as a draft that never
 * unlocks a run.
 *
 * @implements Command<string>
 */
#[HandledBy(ProposeReaderHandler::class)]
final readonly class ProposeReader implements Command
{
    public function __construct(
        public string $commandRequestId,
        public int $declarationRevision,
        public ReaderDefinition $definition,
    ) {}
}
