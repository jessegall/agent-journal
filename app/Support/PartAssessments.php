<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Events\EvidenceInvalid;
use App\Models\Runs\OutputAssessment;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Models\Runs\ReaderPosition;
use App\Models\Runs\ReaderRevision;
use App\Values\ApprovedPair;
use App\Values\OutputProblem;

/**
 * Assesses an ended part with the active approved pair of its operation: the reader replayed over the retained bytes
 * from the first byte into its own position, the validator, a new assessment linked to the one it replaces, and a
 * receipt only from a valid one. Nothing is run again.
 */
final readonly class PartAssessments
{
    public function __construct(
        private ActiveRules $rules,
        private ReaderReplay $replays,
        private EvidenceValidator $validator,
        private ReceiptPublisher $publisher,
        private CommandFacts $facts,
        private RunUpdates $updates,
    ) {}

    /**
     * The approved pair of the part's operation, or none when it is no check with an approved proven reader.
     *
     * @return list<ApprovedPair>
     */
    public function pairOf(PartRun $part): array
    {
        $approved = $this->rules->approvedFor($part->operation);

        if ($approved === [] || $approved[0]->payload->contracts === [] || $approved[0]->reader_approvals === []) {
            return [];
        }

        $reader = ReaderRevision::query()->findOrFail($approved[0]->reader_approvals[0]->readerRevisionId);

        return [new ApprovedPair($approved[0], $approved[0]->payload->contracts[0], $reader)];
    }

    /**
     * The receipt id of the new assessment, or empty when it found problems.
     */
    public function assess(PartRun $part, ApprovedPair $pair): string
    {
        $replayed = $this->replays->replay($pair->reader, $pair->contract, $part);
        ReaderPosition::replayOf($part, $pair->reader, $replayed->consumed)->rewindTo($replayed->consumed);
        $validation = $this->validator->validate($part, $replayed->assessment, $replayed->consumed, $pair->contract);
        $run = ProcessRun::ofAnyActor($part->process_run_id);
        $assessment = OutputAssessment::record($run, $part, $pair->declaration, $pair->reader, $replayed, $validation);
        $this->updates->settled($part);

        if (! $validation->isValid()) {
            $codes = array_map(fn (OutputProblem $problem): string => $problem->code->value, $validation->problems);
            $actor = [(string) $run->actor_type, (string) $run->actor_id];

            $this->facts->publishAfterCommit(
                new EvidenceInvalid($assessment->id, $part->id, $actor[0], $actor[1], $codes),
            );

            return '';
        }

        return $this->publisher->publish($this->validator->verify($assessment))->id;
    }
}
