<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayOperation;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareStatus;
use App\Support\ActorReference;

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

    private function endAndRelease(
        Share $share,
        ShareStatus $terminal,
        ShareAuditType $type,
        ActorReference $actor,
    ): bool {
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
