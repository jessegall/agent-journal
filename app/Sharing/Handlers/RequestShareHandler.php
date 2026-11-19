<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Records\Contracts\RecordResolver;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\RequestShare;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Events\ShareRequested;
use App\Sharing\Exceptions\ShareQuotaReached;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Support\ShareProposalStatus;
use App\Sharing\Support\ShareRecordRegistry;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Checks the root is a shareable type the agent may read now, then, under the installation lock, counts the open
 * proposals and writes the proposal with its audit.
 */
final readonly class RequestShareHandler implements CommandHandler
{
    public function __construct(
        private RecordResolver $records,
        private ShareRecordRegistry $shareable,
        private Dispatcher $events,
    ) {}

    public function handle(RequestShare $command): ShareProposalStatus
    {
        $agent = $command->dispatchedBy();
        $root = new RecordIdentity($command->rootType, $command->rootId);
        $this->shareable->requireShareable($root->type);
        $this->records->requireReadable($root);

        ShareInstallation::lockForAdmission();

        if (Share::proposedCount() >= Share::MOST_PROPOSED) {
            throw ShareQuotaReached::forProposals(Share::MOST_PROPOSED);
        }

        $expiry = CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS);
        $proposal = Share::propose($root, ActorIdentity::of($agent), $expiry);
        ShareAudit::recordFor($proposal, ShareAuditType::Created, ActorIdentity::of($agent), null);
        $this->events->dispatch(new ShareRequested($proposal->fact()));

        return $proposal->proposalStatus();
    }
}
