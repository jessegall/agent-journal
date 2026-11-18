<?php

declare(strict_types=1);

namespace App\Sharing\Actions;

use App\Actors\Support\ActorIdentity;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayOperation;

/**
 * Ends a locked share once, revoked by the owner or expired by the system: its token can no longer be read back, a
 * close of its gateway endpoint is requested when no other live share uses it, and the end is audited. A share that
 * already ended is left as it is.
 */
final readonly class ShareEndings
{
    /**
     * Revokes a live share or dismisses a proposal; returns whether anything changed.
     */
    public function revoke(Share $share, ActorIdentity $owner): bool
    {
        return $this->end($share, ShareState::Revoked, ShareAuditType::Revoked, $owner);
    }

    /**
     * Expires a share or a proposal whose deadline passed; returns whether anything changed.
     */
    public function expire(Share $share): bool
    {
        return $this->end($share, ShareState::Expired, ShareAuditType::Expired, ActorIdentity::system());
    }

    private function end(Share $share, ShareState $terminal, ShareAuditType $type, ActorIdentity $actor): bool
    {
        if ($share->state->isTerminal()) {
            return false;
        }

        $wasLive = $share->state->isLive();
        $share->end($terminal);

        if ($wasLive && $share->isLastLiveOfItsConfiguration()) {
            ShareGatewayOperation::request(ShareGatewayConfiguration::query()->findOrFail($share->share_gateway_configuration_id), GatewayOperationType::Close);
        }

        ShareAudit::recordFor($share, $type, $actor, null);

        return true;
    }
}
