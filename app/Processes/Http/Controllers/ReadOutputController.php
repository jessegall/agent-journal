<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\ReadOutputRequest;
use App\Processes\Commands\RecordEvidenceReads;
use App\Processes\Enums\EvidenceSource;
use App\Processes\Enums\OutputStream;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\OutputSummaries;
use App\Processes\Support\StoredOutput;
use App\Processes\Values\EvidenceRange;
use Illuminate\Http\JsonResponse;

/**
 * Reads a run's stored output for the agent that owns it: another agent never finds the run. Everything it returns is
 * labelled diagnostic output, never a result, and what it showed is recorded as an evidence read.
 */
final readonly class ReadOutputController
{
    public function __construct(
        private StoredOutput $output,
        private OutputSummaries $summaries,
    ) {}

    public function __invoke(ReadOutputRequest $request, ProcessRun $processRun, CommandBus $commands): JsonResponse
    {
        if ($request->mode() === 'summary') {
            return new JsonResponse($this->summaries->of($processRun)->toArray());
        }
        $part = $processRun->parts()->where('syntax_node', $request->partNode())->orderByDesc('attempt')->firstOrFail();
        $stream = $request->stream();
        $source = EvidenceSource::of($stream);
        [$shown, $ranges] = match ($request->mode()) {
            'tail' => $this->tail($part, $stream, $source, $request->tailLines()),
            'search' => [['offsets' => $this->output->search($part, $stream, $request->needle())], []],
            default => $this->raw($part, $stream, $source),
        };
        $commands->run(new RecordEvidenceReads($processRun->id, $ranges));

        return new JsonResponse(['label' => 'diagnostic output', 'stream' => $stream->value, ...$shown]);
    }

    /**
     * The last lines of the stream, and the byte range they were read from.
     *
     * @return array{array<string, mixed>, list<EvidenceRange>}
     */
    private function tail(PartRun $part, OutputStream $stream, EvidenceSource $source, int $lines): array
    {
        $tail = $this->output->tail($part, $stream, $lines);

        return [$tail, [EvidenceRange::bytes($part->id, $source, $tail['before'], $tail['end'])]];
    }

    /**
     * The whole stream, and the byte range it was read from.
     *
     * @return array{array<string, mixed>, list<EvidenceRange>}
     */
    private function raw(PartRun $part, OutputStream $stream, EvidenceSource $source): array
    {
        $bytes = $this->output->bytes($part, $stream);

        return [
            ['bytes' => base64_encode($bytes), 'length' => strlen($bytes)],
            [EvidenceRange::bytes($part->id, $source, 0, strlen($bytes))],
        ];
    }
}
