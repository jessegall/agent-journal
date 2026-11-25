<?php

declare(strict_types=1);

namespace App\Support;

use App\Calls\Processes\CommandRequestShown;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleProposal;
use App\Models\Runs\ReaderRevision;

/**
 * A held command request of the current project as a call and a tool show it: its line, state, steps and next
 * step, with its proposals and readers.
 */
final readonly class CommandRequestViews
{
    public function __construct(private ProjectKey $projects) {}

    public function show(string $requestId): CommandRequestShown
    {
        $request = CommandRequest::query()
            ->ofProject($this->projects->current())
            ->whereKey($requestId)
            ->firstOrFail();

        $next = $request->nextStep;
        $proposals = RuleProposal::query()->ofCommandRequest($request->id)->limit(50)->get();
        $readers = ReaderRevision::query()->ofCommandRequest($request->id)->limit(50)->get();

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
