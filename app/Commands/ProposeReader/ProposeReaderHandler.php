<?php

declare(strict_types=1);

namespace App\Commands\ProposeReader;

use App\Contracts\Bus\CommandHandler;
use App\Enums\RecordRole;
use App\Exceptions\ReaderDefinitionInvalid;
use App\Exceptions\ReaderProposalRefused;
use App\Models\CommandRequest;
use App\Models\ReaderRevision;
use App\Models\RuleProposalRevision;
use App\Support\ActorIdentity;
use App\Support\ProcessAdministration;

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
    public function handle(ProposeReaderCommand $command): string
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

        return ReaderRevision::create($request, $declaration->revision, $label, $command->definition, $actor)->id;
    }
}
