<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\MergeAdmission;
use App\Agents\Exceptions\MergeRefused;
use App\Agents\Values\ApprovedHead;
use App\Agents\Values\OperationKey;
use App\Agents\Values\ReviewDecisionReference;
use App\Supervision\Contracts\AskAdmission;
use App\Supervision\Enums\CoreAskType;
use App\Supervision\Enums\ReviewDecisionType;
use App\Supervision\Models\ReviewDecision;
use App\Supervision\Values\AskReference;
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
        $approval = ReviewDecision::query()->with('review')->whereKey($decision->id)->first();

        if ($approval === null || $approval->decision !== ReviewDecisionType::Approved
            || $approval->merge_ask_id === null) {
            throw MergeRefused::notApproved($decision->id);
        }

        $target = (string) $this->config->get('agents.merge.target_branch');

        if (in_array($target, (array) $this->config->get('agents.merge.protected_branches'), true)) {
            throw MergeRefused::protectedTarget($target);
        }

        $ask = new AskReference($approval->merge_ask_id);
        $operation = new OperationKey(CoreAskType::MergeReady->operation());
        $admitted = $this->admission->requireCurrent($ask, $operation, $expectedVersion);
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
