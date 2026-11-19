<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\ProposeReader;
use App\Processes\Enums\RecordRole;
use App\Processes\Exceptions\ReaderDefinitionInvalid;
use App\Processes\Exceptions\ReaderProposalRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\ReaderRevision;
use App\Processes\Models\RuleProposalRevision;
use App\Processes\Support\ProcessAdministration;

/**
 * Writes a draft reader revision for the request's declaration revision, after checking the definition against the
 * output contract that revision declares.
 */
final readonly class ProposeReaderHandler implements CommandHandler
{
    public function __construct(private ProcessAdministration $administration) {}

    /**
     * @throws ReaderProposalRefused
     * @throws ReaderDefinitionInvalid
     */
    public function handle(ProposeReader $command): string
    {
        $actor = ActorIdentity::of($command->dispatchedBy());
        $request = CommandRequest::lockedForChange($command->commandRequestId);
        if (! $request->acceptsProposalFrom($actor, $this->administration->isGrantedToCaller())) {
            throw ReaderProposalRefused::notTheRequester($request->id);
        }
        if (! $request->state->isOpen()) {
            throw ReaderProposalRefused::closed($request->id);
        }
        $declaration = RuleProposalRevision::query()->answering($request, $command->declarationRevision)->first();
        if ($declaration === null) {
            throw ReaderProposalRefused::declarationMissing($request->id, $command->declarationRevision);
        }
        $contracts = $declaration->payload->contracts;
        if ($contracts === []) {
            throw ReaderProposalRefused::noContract($request->id, $command->declarationRevision);
        }
        if ($contracts[0]->output->isSummaryRequired() && ! $command->definition->hasRole(RecordRole::Summary)) {
            throw ReaderDefinitionInvalid::summaryMissing();
        }

        $label = $contracts[0]->output->label();

        return ReaderRevision::propose($request, $declaration->revision, $label, $command->definition, $actor)->id;
    }
}
