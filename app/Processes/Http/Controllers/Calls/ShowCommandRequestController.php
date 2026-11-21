<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Processes\Calls\CommandRequestShown;
use App\Processes\Calls\ShowCommandRequestCall;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\ReaderRevision;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\ProjectKey;

/**
 * Shows a held command request with its proposals and readers.
 */
final readonly class ShowCommandRequestController
{
    public function __invoke(ShowCommandRequestCall $call, ProjectKey $projects): CommandRequestShown
    {
        $request = CommandRequest::query()
            ->ofProject($projects->current())
            ->whereKey($call->commandRequest)
            ->firstOrFail();

        $next = $request->nextStep();
        $proposals = RuleProposal::query()->where('command_request_id', $request->id)->limit(50)->get();
        $readers = ReaderRevision::query()->where('command_request_id', $request->id)->limit(50)->get();

        return CommandRequestShown::from([
            'requestId' => $request->id,
            'operation' => $request->operation,
            'line' => $request->source_excerpt,
            'state' => $request->state->value,
            'steps' => $next->steps,
            'next' => $next->command,
            'proposals' => $proposals->map(fn (RuleProposal $proposal) => [
                'proposal_id' => $proposal->id,
                'state' => $proposal->state->value,
                'revision' => $proposal->current_revision,
            ])->all(),
            'readers' => $readers->map(fn (ReaderRevision $reader) => [
                'reader_revision_id' => $reader->id,
                'declaration_revision' => $reader->declaration_revision,
                'proven' => $reader->isProven(),
            ])->all(),
        ]);
    }
}
