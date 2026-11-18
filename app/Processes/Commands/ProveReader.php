<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\ProveReaderHandler;

/**
 * An agent or a user asks the journal to prove a request's draft reader against the real sample runs it names; the
 * answer is the proof, after which the request awaits the owner's approval.
 *
 * @implements Command<string>
 */
#[HandledBy(ProveReaderHandler::class)]
final readonly class ProveReader implements Command
{
    /**
     * @param  list<string>  $runIds
     */
    public function __construct(
        public string $commandRequestId,
        public string $readerRevisionId,
        public array $runIds,
    ) {}
}
