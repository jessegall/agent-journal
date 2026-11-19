<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Sharing\Commands\RetryShare;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Support\ShareSummary;

/**
 * Locks the share, puts a pending or failed share back to pending, and requests a fresh open of its gateway with an
 * audit; the token and the deadline stay the same.
 */
final readonly class RetryShareHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private SharePolicy $policy,
    ) {}

    public function handle(RetryShare $command): ShareSummary
    {
        $owner = $this->actors->actor();
        $this->policy->requireManager($owner);
        $share = Share::lockForChange($command->shareId);
        $share->retryOpening();

        ShareGatewayOperation::request($share->gatewayConfiguration(), GatewayOperationType::Open);
        ShareAudit::recordFor($share, ShareAuditType::Retried, ActorIdentity::of($owner), null);

        return $share->summary();
    }
}
