<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Actors\Support\ActorIdentity;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\RuleProposal;
use App\Processes\Models\RuleProposalRevision;
use App\Processes\Values\ProposedRule;

/**
 * Opens rule proposals and adds their revisions: each revision is its own row, and the proposal then makes it current.
 */
final readonly class RuleProposals
{
    /**
     * The proposal of the author's request id: the one it opened before when it proposed the same payload, otherwise
     * a new one with its first revision.
     *
     * @throws RuleProposalRefused when the request id already proposed another payload
     */
    public function open(
        string $projectKey,
        ActorIdentity $author,
        string $requestId,
        ProposedRule $proposed,
        CommandRequest|null $answers,
    ): RuleProposal {
        $proposal = RuleProposal::open($projectKey, $author, $requestId, $proposed, $answers);

        if ($proposal->current_revision === 0) {
            $this->record($proposal, $proposed, $author);
        }

        return $proposal;
    }

    /**
     * The author adds the next revision to the revision they read; an approval of the earlier one no longer fits.
     *
     * @throws RuleProposalRefused
     */
    public function revise(
        RuleProposal $proposal,
        int $expectedRevision,
        ProposedRule $proposed,
        ActorIdentity $author,
    ): RuleProposalRevision {
        $proposal->assertRevisableAt($expectedRevision, $author);

        return $this->record($proposal, $proposed, $author);
    }

    /**
     * @throws RuleProposalRefused
     */
    private function record(RuleProposal $proposal, ProposedRule $proposed, ActorIdentity $author): RuleProposalRevision
    {
        $proposal->assertAcceptsRevision();
        $revision = RuleProposalRevision::createFor($proposal, $proposed, $author);
        $proposal->adopt($revision, $proposed);

        return $revision;
    }
}
