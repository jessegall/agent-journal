<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\ProposeReaderHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\ReaderDefinition;

/**
 * An agent, or a user, proposes the reader for a request's declaration revision; it is stored as a draft that never
 * unlocks a run.
 *
 * @extends Command<string>
 */
#[HandledBy(ProposeReaderHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
#[Operation('propose_reader', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class ProposeReader extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $commandRequestId,
        public int $declarationRevision,
        public ReaderDefinition $definition,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
