<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Http\Requests\Processes\ReadOutputRequest;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\StoredOutput;
use Illuminate\Http\JsonResponse;

/**
 * Reads a run's stored output for the agent that owns it: another agent never finds the run. Everything it returns is
 * labelled diagnostic output, never a result.
 */
final readonly class ReadOutputController
{
    public function __invoke(ReadOutputRequest $request, ProcessRun $processRun, StoredOutput $output): JsonResponse
    {
        if ($request->mode() === 'summary') {
            return new JsonResponse(['label' => 'diagnostic output', 'mode' => $processRun->mode->value, 'lifecycle' => $processRun->lifecycle->value, 'parts' => $processRun->parts()->orderBy('syntax_node')->orderBy('attempt')->readLimit(500)->get()->map(fn (PartRun $part) => [
                'node' => $part->syntax_node,
                'attempt' => $part->attempt,
                'operation' => $part->operation,
                'lifecycle' => $part->lifecycle->value,
                'end' => $part->end_type->value,
                'code' => $part->end()->hasStatus() ? $part->end_code : null,
                'capture' => $part->capture_state->value,
                'bytes' => $part->stream_offsets,
            ])->all()]);
        }
        $part = $processRun->parts()->where('syntax_node', $request->partNode())->orderByDesc('attempt')->firstOrFail();

        return new JsonResponse(['label' => 'diagnostic output', 'stream' => $request->stream()->value, ...match ($request->mode()) {
            'tail' => $output->tail($part, $request->stream(), $request->tailLines()),
            'search' => ['offsets' => $output->search($part, $request->stream(), $request->needle())],
            default => ['bytes' => base64_encode($output->bytes($part, $request->stream()))],
        }]);
    }
}
