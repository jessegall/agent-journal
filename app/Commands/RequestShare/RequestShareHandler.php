<?php

declare(strict_types=1);

namespace App\Commands\RequestShare;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Records\RecordResolver;
use App\Enums\ShareAuditType;
use App\Exceptions\ShareQuotaReached;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareInstallation;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Support\ShareProposal;
use App\Support\ShareProposalStatus;
use App\Support\ShareRecordRegistry;
use Carbon\CarbonImmutable;

/**
 * Checks the root is a shareable type the agent may read now, then, under the installation lock, counts the open
 * proposals and writes the proposal with its audit.
 */
final readonly class RequestShareHandler implements CommandHandler
{
    public function __construct(
        private RecordResolver $records,
        private ShareRecordRegistry $shareable,
    ) {}

    public function handle(RequestShareCommand $command): ShareProposalStatus
    {
        $agent = $command->dispatchedBy();
        $root = new RecordIdentity($command->rootType, $command->rootId);
        $this->shareable->requireShareable($root->type);
        $this->records->requireReadable($root);

        ShareInstallation::create();

        if (Share::proposedCount() >= Share::PROPOSED_LIMIT) {
            throw ShareQuotaReached::forProposals(Share::PROPOSED_LIMIT);
        }

        $expiry = CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS);
        $actor = ActorIdentity::of($agent);
        $proposal = Share::create($root, $expiry, new ShareProposal($actor));
        ShareAudit::create($proposal, ShareAuditType::Created, $actor, null);

        return $proposal->proposalStatus;
    }
}
