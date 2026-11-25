<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Bus\CommandFacts;
use App\Events\Processes\RuleActivated;
use App\Exceptions\ApprovalRefused;
use App\Exceptions\ClassificationRuleRefused;
use App\Exceptions\CommandRuleConflict;
use App\Exceptions\RequestTransitionRefused;
use App\Exceptions\RuleProposalRefused;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleProposalRevision;
use App\Models\CommandRules\RuleRevision;
use App\Models\Runs\ReaderProof;
use App\Values\ApprovalReceipt;
use App\Values\CommandRule;
use App\Values\ExitBranch;
use App\Values\OwnerApproval;
use App\Values\ProvenBranch;
use App\Values\ReaderApproval;

/**
 * An owner's approval of a proposal's current revision, all in the bus's one transaction: the exact revision, no conflict with Core, module or active project rules, a proof that binds
 * this declaration and reader and covers every exit branch, then the immutable approved revision and the active
 * pointer at the revision the owner expected. Approval grants no permission and starts nothing.
 */
final readonly class RuleApprovals
{
    public function __construct(
        private CommandRuleRegistry $rules,
        private ProjectRules $projectRules,
        private CommandFacts $facts,
        private AgentTexts $texts,
    ) {}

    /**
     * @throws RuleProposalRefused
     * @throws ApprovalRefused
     * @throws ClassificationRuleRefused
     * @throws RequestTransitionRefused
     */
    public function approve(RuleProposal $proposal, OwnerApproval $approval, ActorIdentity $approver): ApprovalReceipt
    {
        $proposal->assertReviewable($approval->expectedRevision);
        $declaration = $proposal->revisions()->where('revision', $proposal->current_revision)->sole();
        $rule = $declaration->payload;
        $this->checkConflicts($rule);
        $this->checkReaders($rule, $declaration, $approval->readers);
        $classification = ClassificationRule::forRule($proposal->project_key, $rule);
        $classification->assertExpectedRevision($approval->expectedActiveRevision);
        $request = $proposal->commandRequest()->lockForUpdate()->first();

        $approved = RuleRevision::create($declaration, $proposal->project_key, $approver, $approval->readers, []);
        $classification->activate($approved, $approval->expectedActiveRevision);
        $proposal->approve();

        if ($request !== null && $rule->hasContract()) {
            $request->approve();
        } elseif ($request !== null) {
            $request->approveOrdinary();
        }

        $this->facts->publishAfterCommit(RuleActivated::forRevision($approved, $approval->reason));

        return ApprovalReceipt::of($approved);
    }

    /**
     * The rule must fit beside Core's and modules' rules and the project's other active rules; its own earlier
     * revision is the one it replaces.
     *
     * @throws ApprovalRefused
     */
    private function checkConflicts(CommandRule $rule): void
    {
        $revisions = $this->projectRules->activeRevisions();
        $active = array_map(fn (RuleRevision $revision): CommandRule => $revision->payload, $revisions);
        $others = array_values(array_filter($active, fn (CommandRule $other): bool => ! $other->isSameRuleAs($rule)));

        try {
            $this->rules->withRules(...[
                ...$others,
                $rule,
            ]);
        } catch (CommandRuleConflict $conflict) {
            throw ApprovalRefused::conflict($conflict, $this->texts);
        }
    }

    /**
     * @param  list<ReaderApproval>  $readers
     *
     * @throws ApprovalRefused
     */
    private function checkReaders(CommandRule $rule, RuleProposalRevision $declaration, array $readers): void
    {
        if (! $rule->hasContract()) {
            if ($readers !== []) {
                throw ApprovalRefused::readerWithoutContract($rule->id);
            }

            return;
        }

        if (count($readers) !== 1) {
            throw ApprovalRefused::proofMissing($rule->id);
        }

        $proof = ReaderProof::query()
            ->whereKey($readers[0]->proofId)
            ->ofReaderRevision($readers[0]->readerRevisionId)
            ->first();

        if ($proof === null || ! $this->provesSameDeclaration($proof, $declaration)) {
            throw ApprovalRefused::proofMismatch($readers[0]->proofId);
        }

        $covered = array_map(fn (ProvenBranch $branch): int => $branch->status, $proof->proven_branches);
        $admitted = array_map(fn (ExitBranch $branch): int => $branch->status, $rule->contracts[0]->exits->branches);

        if (array_diff($admitted, $covered) !== []) {
            throw ApprovalRefused::branchesUnproven($proof->id);
        }
    }

    /**
     * A proof binds the declaration it was made for: this revision, or an earlier one with the same payload, as a
     * restored declaration has.
     */
    private function provesSameDeclaration(ReaderProof $proof, RuleProposalRevision $declaration): bool
    {
        if ($proof->rule_proposal_revision_id === $declaration->id) {
            return true;
        }

        $proven = RuleProposalRevision::query()->whereKey($proof->rule_proposal_revision_id)->sole();

        return $proven->payload->digest() === $declaration->payload->digest();
    }
}
