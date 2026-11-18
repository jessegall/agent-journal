<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Processes\Models\CommandRequest;
use App\Processes\Models\ReaderRevision;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\ProjectKey;
use Illuminate\Http\JsonResponse;

/**
 * Shows a command request of the project as stored: its state, what is owed, the exact next command, and its
 * proposals and readers, the same after a restart.
 */
final readonly class ShowCommandRequestController
{
    public function __invoke(string $commandRequest, ProjectKey $projects): JsonResponse
    {
        $request = CommandRequest::query()->ofProject($projects->current())->whereKey($commandRequest)->firstOrFail();
        $next = $request->nextStep();
        $proposals = RuleProposal::query()->where('command_request_id', $request->id)->readLimit(50)->get();
        $readers = ReaderRevision::query()->where('command_request_id', $request->id)->readLimit(50)->get();

        return new JsonResponse([
            'request_id' => $request->id,
            'operation' => $request->operation,
            'line' => $request->source_excerpt,
            'state' => $request->state->value,
            'owed' => $next->obligations,
            'next' => $next->command,
            'proposals' => $proposals->map(fn (RuleProposal $proposal): array => [
                'proposal_id' => $proposal->id,
                'state' => $proposal->state->value,
                'revision' => $proposal->current_revision,
            ])->all(),
            'readers' => $readers->map(fn (ReaderRevision $reader): array => [
                'reader_revision_id' => $reader->id,
                'declaration_revision' => $reader->declaration_revision,
                'proven' => $reader->isProven(),
            ])->all(),
        ]);
    }
}
