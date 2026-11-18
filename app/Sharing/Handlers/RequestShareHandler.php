<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Contracts\CommandHandler;
use App\Records\Contracts\RecordReader;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\RequestShare;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Exceptions\ShareQuotaReached;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Support\ShareProposalStatus;
use App\Sharing\Support\ShareRecordRegistry;
use Carbon\CarbonImmutable;

/**
 * Checks the root is a shareable type the agent may read now, then, under the installation lock, counts the open
 * proposals and writes the proposal with its audit.
 */
final readonly class RequestShareHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private CurrentSession $session,
        private RecordReader $records,
        private ShareRecordRegistry $shareable,
    ) {}

    public function handle(RequestShare $command): ShareProposalStatus
    {
        $agent = $this->actors->actor();
        $root = new RecordIdentity($command->rootType, $command->rootId);
        $this->shareable->requireShareable($root->type);
        $this->records->requireReadable($root);

        ShareInstallation::lockForAdmission();

        if (Share::proposedCount() >= Share::MOST_PROPOSED) {
            throw ShareQuotaReached::forProposals(Share::MOST_PROPOSED);
        }

        $proposal = Share::propose($root, $agent->actorId(), $this->session->sessionId(), CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS));
        ShareAudit::recordFor($proposal, ShareAuditType::Created, ActorIdentity::of($agent), null);

        return $proposal->proposalStatus();
    }
}
