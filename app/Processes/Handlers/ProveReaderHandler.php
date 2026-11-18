<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\ProveReader;
use App\Processes\Enums\RequestState;
use App\Processes\Exceptions\ReaderProofFailed;
use App\Processes\Exceptions\ReaderProposalRefused;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\ReaderProof;
use App\Processes\Models\ReaderRevision;
use App\Processes\Models\RuleProposalRevision;
use App\Processes\Support\ReaderProofCheck;

/**
 * Proves the request's draft reader against its sample runs, records the proof and moves the request on to the owner's
 * approval; a failing check keeps the request awaiting proof and names what failed.
 */
final readonly class ProveReaderHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors, private ReaderProofCheck $check) {}

    /**
     * @throws ReaderProofFailed
     * @throws ReaderProposalRefused
     * @throws RequestTransitionRefused
     */
    public function handle(ProveReader $command): string
    {
        $request = CommandRequest::query()->whereKey($command->commandRequestId)->lockForUpdate()->sole();
        if ($request->state !== RequestState::AwaitingProof) {
            throw ReaderProofFailed::notAwaiting($request->nextStep()->command);
        }
        $reader = ReaderRevision::query()
            ->whereKey($command->readerRevisionId)
            ->where('command_request_id', $request->id)
            ->sole();
        $declaration = RuleProposalRevision::query()->answering($request, $reader->declaration_revision)->first();
        if ($declaration === null || $declaration->payload->contracts === []) {
            throw ReaderProposalRefused::noContract($request->id, $reader->declaration_revision);
        }

        $branches = $this->check->prove($request, $reader, $declaration->payload->contracts[0], $command->runIds);
        $proof = ReaderProof::record($reader, $declaration, $branches, ActorIdentity::of($this->actors->actor()));
        $request->prove();

        return $proof->id;
    }
}
