<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use App\Support\ActorReference;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;

/**
 * Ends a locked share once, revoked by the owner or expired by the system: its token can no longer be read back, a
 * close of its gateway endpoint is requested when no other live share uses it, and the end is audited. A share that
 * already ended is left as it is; the share raises its own ending fact.
 */
final readonly class ShareEndings
{
    /**
     * Revokes a live share or dismisses a proposal; returns whether anything changed.
     */
    public function revoke(Share $share, ActorReference $owner): bool
    {
        return $this->endAndRelease($share, ShareStatus::Revoked, ShareAuditType::Revoked, $owner);
    }

    /**
     * Expires a share or a proposal whose deadline passed; returns whether anything changed.
     */
    public function expire(Share $share): bool
    {
        return $this->endAndRelease($share, ShareStatus::Expired, ShareAuditType::Expired, ActorReference::system());
    }

    /**
     * Revokes every share of the configuration's gateway, all before any close is requested; the caller closes the
     * gateway once they have ended.
     *
     * @param  list<Share>  $shares  locked, by id
     */
    public function revokeAll(array $shares, ActorReference $owner): void
    {
        foreach ($shares as $share) {
            $this->end($share, ShareStatus::Revoked, ShareAuditType::Revoked, $owner);
        }
    }

    private function endAndRelease(Share $share, ShareStatus $terminal, ShareAuditType $type, ActorReference $actor): bool
    {
        $wasLive = $share->status->isLive();

        if (! $this->end($share, $terminal, $type, $actor)) {
            return false;
        }

        if ($wasLive && $share->isLastLiveOfItsConfiguration()) {
            $configuration = ShareGatewayConfiguration::query()->findOrFail($share->share_gateway_configuration_id);
            ShareGatewayOperation::create($configuration, GatewayOperationType::Close);
        }

        return true;
    }

    private function end(Share $share, ShareStatus $terminal, ShareAuditType $type, ActorReference $actor): bool
    {
        if (! $share->end($terminal)) {
            return false;
        }

        ShareAudit::create($share, $type, $actor, null);

        return true;
    }
}
