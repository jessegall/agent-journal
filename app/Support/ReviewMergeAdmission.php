<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Admission\AskAdmission;
use App\Contracts\Admission\MergeAdmission;
use App\Enums\CoreAskType;
use App\Enums\ReviewDecisionType;
use App\Exceptions\MergeRefused;
use App\Models\Reviews\ReviewDecision;
use App\Values\ApprovedHead;
use App\Values\AskReference;
use App\Values\ReviewDecisionReference;
use Illuminate\Contracts\Config\Repository;

/**
 * Admits a merge only for the current holder of the approval's merge ask, at the version they read and with the
 * merge operation granted, onto the configured integration branch, never a protected one.
 */
final readonly class ReviewMergeAdmission implements MergeAdmission
{
    public function __construct(private AskAdmission $admission, private Repository $config) {}

    public function requireApproval(
        ActorIdentity $caller,
        ReviewDecisionReference $decision,
        int $expectedVersion,
    ): ApprovedHead {
        $approval = ReviewDecision::query()->withReview()->whereKey($decision->id)->first();

        if ($approval === null || $approval->decision !== ReviewDecisionType::Approved
            || $approval->merge_ask_id === null) {
            throw MergeRefused::notApproved($decision->id);
        }

        $target = (string) $this->config->get('agents.merge.target_branch');

        if (in_array($target, (array) $this->config->get('agents.merge.protected_branches'), true)) {
            throw MergeRefused::protectedTarget($target);
        }

        $ask = new AskReference($approval->merge_ask_id);

        $admitted = $this->admission->requireCurrent(
            $ask,
            CoreAskType::MergeReady->requiredCommand(),
            $expectedVersion,
        );

        $review = $approval->review;

        return new ApprovedHead(
            $review->work(),
            $review->certificate,
            $target,
            $approval->base,
            $approval->head,
            (string) $review->import_ref,
            $decision,
            $admitted->actor,
            $ask->id,
            $admitted->version,
        );
    }
}
