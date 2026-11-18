<?php

declare(strict_types=1);

namespace App\Sharing\Actions;

use App\Actors\Support\ActorIdentity;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Events\ShareExpired;
use App\Sharing\Events\ShareRevoked;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayOperation;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Ends a locked share once, revoked by the owner or expired by the system: its token can no longer be read back, a
 * close of its gateway endpoint is requested when no other live share uses it, and the end is audited. A share that
 * already ended is left as it is.
 */
final readonly class ShareEndings
{
    public function __construct(private Dispatcher $events) {}

    /**
     * Revokes a live share or dismisses a proposal; returns whether anything changed.
     */
    public function revoke(Share $share, ActorIdentity $owner): bool
    {
        if (! $this->endAndRelease($share, ShareState::Revoked, ShareAuditType::Revoked, $owner)) {
            return false;
        }

        $this->events->dispatch(new ShareRevoked($share->fact()));

        return true;
    }

    /**
     * Expires a share or a proposal whose deadline passed; returns whether anything changed.
     */
    public function expire(Share $share): bool
    {
        if (! $this->endAndRelease($share, ShareState::Expired, ShareAuditType::Expired, ActorIdentity::system())) {
            return false;
        }

        $this->events->dispatch(new ShareExpired($share->fact()));

        return true;
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
            if ($this->end($share, ShareState::Revoked, ShareAuditType::Revoked, $owner)) {
                $this->events->dispatch(new ShareRevoked($share->fact()));
            }
        }
    }

    private function endAndRelease(Share $share, ShareState $terminal, ShareAuditType $type, ActorIdentity $actor): bool
    {
        $wasLive = $share->state->isLive();

        if (! $this->end($share, $terminal, $type, $actor)) {
            return false;
        }

        if ($wasLive && $share->isLastLiveOfItsConfiguration()) {
            ShareGatewayOperation::request(ShareGatewayConfiguration::query()->findOrFail($share->share_gateway_configuration_id), GatewayOperationType::Close);
        }

        return true;
    }

    private function end(Share $share, ShareState $terminal, ShareAuditType $type, ActorIdentity $actor): bool
    {
        if ($share->state->isTerminal()) {
            return false;
        }

        $share->end($terminal);
        ShareAudit::recordFor($share, $type, $actor, null);

        return true;
    }
}
