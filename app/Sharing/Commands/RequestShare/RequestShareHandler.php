<?php

declare(strict_types=1);

namespace App\Sharing\Commands\RequestShare;

use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareInstallation;
use App\Records\Contracts\RecordResolver;
use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Exceptions\ShareQuotaReached;
use App\Sharing\Support\ShareProposal;
use App\Sharing\Support\ShareProposalStatus;
use App\Sharing\Support\ShareRecordRegistry;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;

/**
 * Checks the root is a shareable type the agent may read now, then, under the installation lock, counts the open
 * proposals and writes the proposal with its audit.
 */
final readonly class RequestShareHandler extends SharingCommandHandler
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
        $rootOwner = $this->shareable->ownerOf($root);

        ShareInstallation::create();

        if (Share::resolveProposedCount() >= Share::PROPOSED_LIMIT) {
            throw ShareQuotaReached::forProposals(Share::PROPOSED_LIMIT);
        }

        $expiry = CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS);
        $actor = $agent;
        $proposal = Share::create($root, $rootOwner, $expiry, new ShareProposal($actor));
        ShareAudit::create($proposal, ShareAuditType::Created, $actor, null);

        return $proposal->proposalStatus;
    }
}
