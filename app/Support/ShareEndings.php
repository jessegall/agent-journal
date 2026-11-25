<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\GatewayOperationType;
use App\Enums\ShareAuditType;
use App\Enums\ShareState;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayOperation;

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
    public function revoke(Share $share, ActorIdentity $owner): bool
    {
        return $this->endAndRelease($share, ShareState::Revoked, ShareAuditType::Revoked, $owner);
    }

    /**
     * Expires a share or a proposal whose deadline passed; returns whether anything changed.
     */
    public function expire(Share $share): bool
    {
        return $this->endAndRelease($share, ShareState::Expired, ShareAuditType::Expired, ActorIdentity::system());
    }

    /**
     * Revokes every share of the configuration's gateway, all before any close is requested; the caller closes the
     * gateway once they have ended.
     *
     * @param  list<Share>  $shares  locked, by id
     */
    public function revokeAll(array $shares, ActorIdentity $owner): void
    {
        foreach ($shares as $share) {
            $this->end($share, ShareState::Revoked, ShareAuditType::Revoked, $owner);
        }
    }

    private function endAndRelease(Share $share, ShareState $terminal, ShareAuditType $type, ActorIdentity $actor): bool
    {
        $wasLive = $share->state->isLive();

        if (! $this->end($share, $terminal, $type, $actor)) {
            return false;
        }

        if ($wasLive && $share->isLastLiveOfItsConfiguration()) {
            ShareGatewayOperation::createForConfiguration(
                ShareGatewayConfiguration::query()->findOrFail($share->share_gateway_configuration_id),
                GatewayOperationType::Close,
            );
        }

        return true;
    }

    private function end(Share $share, ShareState $terminal, ShareAuditType $type, ActorIdentity $actor): bool
    {
        if (! $share->end($terminal)) {
            return false;
        }

        ShareAudit::create($share, $type, $actor, null);

        return true;
    }
}
