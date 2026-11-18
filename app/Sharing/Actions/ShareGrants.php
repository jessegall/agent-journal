<?php

declare(strict_types=1);

namespace App\Sharing\Actions;

use App\Actors\Contracts\Actor;
use App\Actors\Support\ActorIdentity;
use App\Reads\Contracts\ReadMeter;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Exceptions\ShareProposalUnavailable;
use App\Sharing\Exceptions\ShareQuotaReached;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Models\ShareMember;
use App\Sharing\Models\SharePreview;
use App\Sharing\Support\ConsumedPreview;
use App\Sharing\Support\MeteredShareBudget;
use App\Sharing\Support\ShareDuration;
use App\Sharing\Support\ShareScope;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;

/**
 * The owner's grants: a new share, or an agent's proposal approved, each from a fresh preview. Both lock the
 * installation, the preview's configuration and the preview in that order, consume the preview, count the live shares
 * under the lock, and write the grant with a new token, its approved members, an open request for its gateway and its
 * audit in the command's transaction.
 */
final readonly class ShareGrants
{
    public function __construct(
        private SharePolicy $policy,
        private ShareScope $scope,
        private ReadMeter $meter,
    ) {}

    public function create(Actor $owner, string $previewId, string $previewChecksum, ShareDuration $duration): Share
    {
        $consumed = $this->consume($owner, $previewId, $previewChecksum);
        $share = Share::grant($consumed->root, $owner->actorId(), $consumed->configuration, ShareToken::generate(), $duration->deadlineFrom(CarbonImmutable::now()));

        return $this->publish($owner, $share, $consumed, ShareAuditType::Created);
    }

    /**
     * @throws ShareProposalUnavailable when the proposal is not open or the preview shows another root
     */
    public function approve(Actor $owner, string $proposalId, string $previewId, string $previewChecksum, ShareDuration $duration): Share
    {
        $consumed = $this->consume($owner, $previewId, $previewChecksum);
        $proposal = Share::lockProposal($proposalId);

        if (! $proposal->root()->isSameAs($consumed->root)) {
            throw ShareProposalUnavailable::forOtherRoot($proposalId);
        }

        $proposal->approveAs($owner->actorId(), $consumed->configuration, ShareToken::generate(), $duration->deadlineFrom(CarbonImmutable::now()));

        return $this->publish($owner, $proposal, $consumed, ShareAuditType::Approved);
    }

    /**
     * Takes the locks in order, uses the preview once and refuses a grant past the live limit.
     *
     * @throws ShareQuotaReached
     */
    private function consume(Actor $owner, string $previewId, string $previewChecksum): ConsumedPreview
    {
        $this->policy->requireManager($owner);
        $configurationId = SharePreview::of($previewId)->share_gateway_configuration_id;

        ShareInstallation::lockForAdmission();
        $configuration = ShareGatewayConfiguration::lockUsable($configurationId);
        $preview = SharePreview::lockFor($previewId);
        $candidates = $this->scope->discover($preview->root(), MeteredShareBudget::forPreview($this->meter));
        $selection = $preview->consumeFor($owner->actorId(), $previewChecksum, $candidates);

        if (Share::liveCount() >= Share::MOST_LIVE) {
            throw ShareQuotaReached::at(Share::MOST_LIVE);
        }

        return new ConsumedPreview($configuration, $preview->root(), $selection, $candidates);
    }

    private function publish(Actor $owner, Share $share, ConsumedPreview $consumed, ShareAuditType $type): Share
    {
        foreach ($consumed->selection as $target) {
            ShareMember::approve($share, $consumed->candidates->sourceOf($target), $target);
        }

        ShareGatewayOperation::request($consumed->configuration, GatewayOperationType::Open);
        ShareAudit::recordFor($share, $type, ActorIdentity::of($owner), null);

        return $share;
    }
}
