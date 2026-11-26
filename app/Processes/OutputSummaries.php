<?php

declare(strict_types=1);

namespace App\Processes;

use App\Api\Processes\OutputSummary;
use App\Api\Processes\PartSummary;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\ResultReceipts;
use App\CommandRules\Commands\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Models\Runs\OutputAssessment;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Processes\Run\PartResult;
use App\Processes\Values\OutputProblem;
use App\Values\EvidenceRange;

/**
 * Builds a run's output summary and records it as evidence read: each part with how it ended and its result as the
 * one receipt gate answers it, never a pass read from the exit.
 */
final readonly class OutputSummaries
{
    public function __construct(private ResultReceipts $receipts, private CommandBus $commands) {}

    public function of(ProcessRun $run): OutputSummary
    {
        $parts = $run->parts()->bySyntaxNodeThenAttempt()->readLimit(500)->get();
        $envelopes = $parts->map(fn (PartRun $part) => EvidenceRange::envelope($part->id))->all();
        $this->commands->run(new RecordEvidenceReadsCommand($run->id, array_values($envelopes)));

        return OutputSummary::from([
            'label' => 'diagnostic output',
            'mode' => $run->mode->value,
            'lifecycle' => $run->lifecycle->value,
            'parts' => array_values($parts->map(fn (PartRun $part) => $this->partOf($run, $part))->all()),
        ]);
    }

    private function partOf(ProcessRun $run, PartRun $part): PartSummary
    {
        return PartSummary::from([
            'node' => $part->syntax_node,
            'attempt' => $part->attempt,
            'operation' => $part->operation,
            'lifecycle' => $part->lifecycle->value,
            'end' => $part->end_type->value,
            'code' => $part->end->hasStatus() ? $part->end_code : null,
            'capture' => $part->capture_state->value,
            'bytes' => $part->stream_offsets,
            'result' => $this->resultOf($run, $part)->toArray(),
        ]);
    }

    /**
     * The part's result as the one receipt gate answers it, or why there is none.
     */
    private function resultOf(ProcessRun $run, PartRun $part): PartResult
    {
        if (! $run->mayAnswer()) {
            return PartResult::evidenceOnly();
        }

        $receipt = $this->receipts->forPart($part->id);

        if ($receipt->isDefined()) {
            return PartResult::receipted($receipt->get()->outcome->value, $receipt->get()->receiptId);
        }

        $assessment = OutputAssessment::findLatestOf($part);

        if ($assessment === null) {
            return PartResult::unavailable(['no assessment']);
        }

        $codes = array_map(fn (OutputProblem $problem) => $problem->code->value, $assessment->problems->items());

        return PartResult::unavailable($codes);
    }
}
