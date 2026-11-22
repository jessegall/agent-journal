<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Admission\AskAdmission;
use App\Contracts\Assignments\JournalAssignmentWriter;
use App\Enums\AskOriginType;
use App\Enums\CodeReviewState;
use App\Enums\CoreAskType;
use App\Enums\ReviewDecisionType;
use App\Models\AskHop;
use App\Models\CodeReview;
use App\Models\ReviewDecision;
use App\Values\AskReference;
use App\Values\SupervisorTarget;

/**
 * Records a reviewer's typed decision on the open review its ask holds and resolves that ask; an approval opens one
 * merge ask on the merge route of the role the review was first sent to, whoever approved it after escalation, and a
 * return sends the work back to its worker for repair.
 */
final readonly class CodeReviewDecisions
{
    public function __construct(
        private AskRecords $asks,
        private AskAdmission $admission,
        private JournalAssignmentWriter $assignments,
        private AskAttention $attention,
        private AskTypeRegistry $types,
        private AskOpening $opening,
        private AskRouter $router,
        private RepairRouting $repairs,
    ) {}

    public function decide(
        AskReference $reference,
        int $expectedVersion,
        ReviewDecisionType $decision,
        ActorIdentity $reviewer,
        string $findings,
    ): ReviewDecision {
        $ask = $this->asks->lock($reference);
        $this->admission->requireCurrent($reference, CoreAskType::ReviewReady->requiredCommand(), $expectedVersion);
        $review = CodeReview::openFor($reference);
        $made = ReviewDecision::create($review, $decision, $reviewer, $findings);
        $hop = AskHop::currentFor($ask);
        $this->attention->retainReply($ask, $hop, "Review {$decision->value}: {$findings}");
        $this->assignments->releaseForJournal($ask->assignmentIdentity());
        $ask->close();
        $this->attention->finishAnswering($hop->actor());

        if ($decision === ReviewDecisionType::Returned) {
            $review->settle(CodeReviewState::Returned);
            $this->repairs->send("decision:{$made->id}", $review, $reviewer, $findings, null);

            return $made;
        }

        $review->settle(CodeReviewState::Approved);
        $this->openMerge($review, $made, $reviewer);

        return $made;
    }

    private function openMerge(CodeReview $review, ReviewDecision $decision, ActorIdentity $approver): void
    {
        $type = $this->types->get(CoreAskType::MergeReady->key());
        $origin = SupervisorTarget::parse((string) $review->origin_target);
        $body = "Merge the approved work under {$review->import_ref}: {$decision->base}..{$decision->head}.";

        $merge = $origin->isProfile()
            ? $this->opening->openOnProfile(
                $origin->profileKey(),
                $approver,
                $type,
                "merge-ready:{$decision->id}",
                $body,
                $review->work(),
                AskOriginType::Internal,
            )
            : $this->opening->open(
                $approver,
                $type,
                "merge-ready:{$decision->id}",
                $body,
                $review->work(),
                AskOriginType::Internal,
            );

        $decision->linkMerge($merge);
        $this->router->route($merge, 0, null);
    }
}
