<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Reads\Contracts\ReadMeter;
use App\Sharing\Commands\CreateShare;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Exceptions\ShareQuotaReached;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Models\ShareMember;
use App\Sharing\Models\SharePreview;
use App\Sharing\Support\MeteredShareBudget;
use App\Sharing\Support\ShareDuration;
use App\Sharing\Support\ShareScope;
use App\Sharing\Support\ShareSummary;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;

/**
 * Locks the installation, the preview's configuration and the preview in that order, consumes the preview, counts the
 * live shares under the lock, and grants the share with a new token, its approved members, an open request for its
 * gateway and its audit, all in the command's transaction.
 */
final readonly class CreateShareHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private SharePolicy $policy,
        private ShareScope $scope,
        private ReadMeter $meter,
    ) {}

    public function handle(CreateShare $command): ShareSummary
    {
        $owner = $this->actors->actor();
        $this->policy->requireManager($owner);
        $duration = ShareDuration::of($command->minutesUntilExpiry);
        $configurationId = SharePreview::of($command->previewId)->share_gateway_configuration_id;

        ShareInstallation::lockForAdmission();
        $configuration = ShareGatewayConfiguration::lockUsable($configurationId);
        $preview = SharePreview::lockFor($command->previewId);
        $candidates = $this->scope->discover($preview->root(), MeteredShareBudget::forPreview($this->meter));
        $selection = $preview->consumeFor($owner->actorId(), $command->previewChecksum, $candidates);

        if (Share::liveCount() >= Share::MOST_LIVE) {
            throw ShareQuotaReached::at(Share::MOST_LIVE);
        }

        $share = Share::grant($preview->root(), $owner->actorId(), $configuration, ShareToken::generate(), $duration->deadlineFrom(CarbonImmutable::now()));

        foreach ($selection as $target) {
            ShareMember::approve($share, $candidates->sourceOf($target), $target);
        }

        ShareGatewayOperation::request($configuration, GatewayOperationType::Open);
        ShareAudit::recordFor($share, ShareAuditType::Created, ActorIdentity::of($owner), null);

        return $share->summary();
    }
}
