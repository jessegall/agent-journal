<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\RequestShare;

use App\Contracts\Records\RecordResolver;
use App\Support\RecordIdentity;
use App\Support\ShareRecordRegistry;
use Carbon\CarbonImmutable;
use Domain\Sharing\Commands\Support\SharingCommandHandler;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Exceptions\ShareQuotaReached;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareInstallation;
use Domain\Sharing\Support\ShareProposal;
use Domain\Sharing\Support\ShareProposalStatus;

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

        ShareInstallation::create();

        if (Share::resolveProposedCount() >= Share::PROPOSED_LIMIT) {
            throw ShareQuotaReached::forProposals(Share::PROPOSED_LIMIT);
        }

        $expiry = CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS);
        $actor = $agent;
        $proposal = Share::create($root, $expiry, new ShareProposal($actor));
        ShareAudit::create($proposal, ShareAuditType::Created, $actor, null);

        return $proposal->proposalStatus;
    }
}
