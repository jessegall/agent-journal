<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\ReadOutputRequest;
use App\Processes\Commands\RecordEvidenceReads;
use App\Processes\Contracts\ResultReceipts;
use App\Processes\Enums\EvidenceSource;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\RunMode;
use App\Processes\Models\OutputAssessment;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\StoredOutput;
use App\Processes\Values\EvidenceRange;
use App\Processes\Values\OutputProblem;
use Illuminate\Http\JsonResponse;

/**
 * Reads a run's stored output for the agent that owns it: another agent never finds the run. Everything it returns is
 * labelled diagnostic output, never a result, and what it showed is recorded as an evidence read.
 */
final readonly class ReadOutputController
{
    public function __construct(
        private StoredOutput $output,
        private ResultReceipts $receipts,
    ) {}

    public function __invoke(ReadOutputRequest $request, ProcessRun $processRun, CommandBus $commands): JsonResponse
    {
        if ($request->mode() === 'summary') {
            return $this->summary($processRun, $commands);
        }
        $part = $processRun->parts()->where('syntax_node', $request->partNode())->orderByDesc('attempt')->firstOrFail();
        $stream = $request->stream();
        $source = EvidenceSource::of($stream);
        $shown = match ($request->mode()) {
            'tail' => $this->output->tail($part, $stream, $request->tailLines()),
            'search' => ['offsets' => $this->output->search($part, $stream, $request->needle())],
            default => $this->raw($part, $stream),
        };
        $ranges = match ($request->mode()) {
            'tail' => [EvidenceRange::bytes($part->id, $source, $shown['before'], $shown['end'])],
            'search' => [],
            default => [EvidenceRange::bytes($part->id, $source, 0, $shown['length'])],
        };
        $commands->run(new RecordEvidenceReads($processRun->id, $ranges));

        return new JsonResponse(['label' => 'diagnostic output', 'stream' => $stream->value, ...$shown]);
    }

    /**
     * @return array{bytes: string, length: int}
     */
    private function raw(PartRun $part, OutputStream $stream): array
    {
        $bytes = $this->output->bytes($part, $stream);

        return ['bytes' => base64_encode($bytes), 'length' => strlen($bytes)];
    }

    /**
     * The part's result as the one receipt gate answers it, or why there is none.
     */
    private function resultOf(ProcessRun $run, PartRun $part): string
    {
        if ($run->mode === RunMode::Evidence) {
            return 'evidence only';
        }
        $receipt = $this->receipts->forPart($part->id);
        if ($receipt->isDefined()) {
            return "result {$receipt->get()->outcome->value}, receipt {$receipt->get()->receiptId}";
        }
        $assessment = OutputAssessment::query()->where('part_run_id', $part->id)->latest('created_at')->first();
        if ($assessment === null) {
            return 'result unavailable: no assessment';
        }
        $codes = array_map(fn (OutputProblem $problem): string => $problem->code->value, $assessment->problems);

        return 'result unavailable: '.implode(', ', $codes);
    }

    private function summary(ProcessRun $run, CommandBus $commands): JsonResponse
    {
        $parts = $run->parts()->orderBy('syntax_node')->orderBy('attempt')->readLimit(500)->get();
        $envelopes = $parts->map(fn (PartRun $part): EvidenceRange => EvidenceRange::envelope($part->id))->all();
        $commands->run(new RecordEvidenceReads($run->id, array_values($envelopes)));

        return new JsonResponse([
            'label' => 'diagnostic output',
            'mode' => $run->mode->value,
            'lifecycle' => $run->lifecycle->value,
            'parts' => $parts->map(fn (PartRun $part): array => [
                'node' => $part->syntax_node,
                'attempt' => $part->attempt,
                'operation' => $part->operation,
                'lifecycle' => $part->lifecycle->value,
                'end' => $part->end_type->value,
                'code' => $part->end()->hasStatus() ? $part->end_code : null,
                'capture' => $part->capture_state->value,
                'bytes' => $part->stream_offsets,
                'result' => $this->resultOf($run, $part),
            ])->all(),
        ]);
    }
}
