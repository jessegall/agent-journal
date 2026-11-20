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
use App\Processes\Handlers\ProveReaderHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * An agent or a user asks the journal to prove a request's draft reader against the real sample runs it names; the
 * answer is the proof, after which the request awaits the owner's approval.
 *
 * @extends Command<string>
 */
#[HandledBy(ProveReaderHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
#[Operation('prove_reader', ResourceAreaType::Workspace, AccessType::Test)]
final readonly class ProveReader extends Command implements AuthorizedCommand
{
    /**
     * @param  list<string>  $runIds
     */
    public function __construct(
        public string $commandRequestId,
        public string $readerRevisionId,
        public array $runIds,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
