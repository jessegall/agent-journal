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
use App\Sharing\Exceptions\ShareRefreshRefused;
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
use App\Sharing\Support\ShareGrant;
use App\Sharing\Support\ShareScope;
use App\Sharing\Support\ShareSelectedTarget;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;

/**
 * The owner's grants: a new share, an agent's proposal approved, or a live share's members replaced, each from a
 * fresh preview. Each locks the installation, the preview's configuration and the preview in that order and consumes
 * the preview; a new grant counts the live shares under the lock and writes a new token and an open request for its
 * gateway; every one writes its approved members and its audit in the command's transaction.
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
        $this->assertLiveSlotFree();
        $share = Share::create(
            $consumed->root,
            $duration->deadlineFrom(CarbonImmutable::now()),
            new ShareGrant(
                $owner->actorId(),
                $consumed->configuration->id,
                $consumed->configuration->configuration_version,
                ShareToken::generate(),
            ),
        );
        ShareGatewayOperation::create($consumed->configuration, GatewayOperationType::Open);

        $this->publish($owner, $share, $consumed, ShareAuditType::Created);

        return $share;
    }

    /**
     * @throws ShareProposalUnavailable when the proposal is not open or the preview shows another root
     */
    public function approve(
        Actor $owner,
        string $proposalId,
        string $previewId,
        string $previewChecksum,
        ShareDuration $duration,
    ): Share {
        $consumed = $this->consume($owner, $previewId, $previewChecksum);
        $this->assertLiveSlotFree();
        $proposal = Share::lockProposal($proposalId);

        if (! $proposal->root()->isSameAs($consumed->root)) {
            throw ShareProposalUnavailable::forOtherRoot($proposalId);
        }

        $proposal->approveAs(
            $owner->actorId(),
            $consumed->configuration,
            ShareToken::generate(),
            $duration->deadlineFrom(CarbonImmutable::now()),
        );
        ShareGatewayOperation::create($consumed->configuration, GatewayOperationType::Open);

        $this->publish($owner, $proposal, $consumed, ShareAuditType::Approved);

        return $proposal;
    }

    /**
     * Replaces a live share's members with the preview's selection at the next scope version; its token, deadline
     * and gateway stay as they are.
     *
     * @throws ShareRefreshRefused when the share is not live or the preview shows another root
     */
    public function refresh(Actor $owner, string $shareId, string $previewId, string $previewChecksum): Share
    {
        $consumed = $this->consume($owner, $previewId, $previewChecksum);
        $share = Share::lockForChange($shareId);

        if (! $share->state->isLive() || ! $share->expires_at->isFuture()) {
            throw ShareRefreshRefused::notLive($shareId, $share->state);
        }

        if (! $share->root()->isSameAs($consumed->root)) {
            throw ShareRefreshRefused::otherRoot($shareId);
        }

        $this->forgetAllOf($share);
        $share->advanceScope();

        $this->publish($owner, $share, $consumed, ShareAuditType::ScopeRefreshed);

        return $share;
    }

    /**
     * Takes the locks in order and uses the preview once.
     */
    private function consume(Actor $owner, string $previewId, string $previewChecksum): ConsumedPreview
    {
        $this->policy->assertManager($owner);
        $configurationId = SharePreview::of($previewId)->share_gateway_configuration_id;

        ShareInstallation::create();
        $configuration = ShareGatewayConfiguration::lockUsable($configurationId);
        $preview = SharePreview::lockFor($previewId);
        $candidates = $this->scope->discover($preview->root(), MeteredShareBudget::forPreview($this->meter));
        $selection = $preview->consumeFor($owner->actorId(), $previewChecksum, $candidates);

        return new ConsumedPreview($configuration, $preview->root(), $selection, $candidates);
    }

    /**
     * Refuses a new grant once the installation holds its most live shares; counted under the installation lock.
     *
     * @throws ShareQuotaReached
     */
    private function assertLiveSlotFree(): void
    {
        if (Share::liveCount() >= Share::LIVE_LIMIT) {
            throw ShareQuotaReached::at(Share::LIVE_LIMIT);
        }
    }

    private function publish(Actor $owner, Share $share, ConsumedPreview $consumed, ShareAuditType $type): void
    {
        ShareMember::createAll(array_map(
            fn (ShareSelectedTarget $target) => ShareMember::unsaved(
                $share,
                $consumed->candidates->sourceOf($target),
                $target,
            ),
            $consumed->selection,
        ));

        ShareAudit::create($share, $type, ActorIdentity::of($owner), null);
    }

    /**
     * Removes every member of the share, of every scope version, before a refreshed scope replaces them.
     */
    private function forgetAllOf(Share $share): void
    {
        ShareMember::query()->ofShare($share)->delete();
    }
}
