<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ProveReader;

use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Exceptions\ReaderProofFailed;
use App\CommandRules\Exceptions\ReaderProposalRefused;
use App\CommandRules\Exceptions\RequestTransitionRefused;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleProposalRevision;
use App\Models\Runs\ReaderProof;
use App\Models\Runs\ReaderRevision;
use App\Processes\ReaderProofCheck;

/**
 * Proves the request's draft reader against its sample runs, records the proof and moves the request on to the owner's
 * approval; a failing check keeps the request awaiting proof and names what failed.
 */
final readonly class ProveReaderHandler implements CommandHandler
{
    public function __construct(private ReaderProofCheck $check) {}

    /**
     * @throws ReaderProofFailed
     * @throws ReaderProposalRefused
     * @throws RequestTransitionRefused
     */
    public function handle(ProveReaderCommand $command): string
    {
        $request = CommandRequest::findLockedForChange($command->commandRequestId);

        if (! $request->awaitsProof()) {
            throw ReaderProofFailed::notAwaiting($request->nextStep->command);
        }

        $reader = ReaderRevision::query()
            ->whereKey($command->readerRevisionId)
            ->ofCommandRequest($request->id)
            ->sole();

        $declaration = RuleProposalRevision::query()->answering($request, $reader->declaration_revision)->first();

        if ($declaration === null || $declaration->payload->contracts === []) {
            throw ReaderProposalRefused::noContract($request->id, $reader->declaration_revision);
        }

        $branches = $this->check->prove($request, $reader, $declaration->payload->contracts[0], $command->runIds);
        $proof = ReaderProof::create($reader, $declaration, $branches, $command->dispatchedBy());
        $request->prove();

        return $proof->getKey();
    }
}
