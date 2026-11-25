<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\SaveSharePreview;

use App\Contracts\Reads\ReadMeter;
use App\Contracts\Sharing\SharePolicy;
use App\Support\RecordIdentity;
use Domain\Sharing\Commands\Support\SharingCommandHandler;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\SharePreview;
use Domain\Sharing\Support\SavedSharePreview;
use Domain\Sharing\Support\ShareBudget;
use Domain\Sharing\Support\ShareScope;

final readonly class SaveSharePreviewHandler extends SharingCommandHandler
{
    public function __construct(
        private SharePolicy $policy,
        private ShareScope $scope,
        private ReadMeter $meter,
    ) {}

    public function handle(SaveSharePreviewCommand $command): SavedSharePreview
    {
        $owner = $command->dispatchedBy();
        $this->policy->assertManager($owner);
        $root = new RecordIdentity($command->rootType, $command->rootId);

        $configuration = $command->gatewayConfigurationId === null
            ? ShareGatewayConfiguration::usableDefault()
            : ShareGatewayConfiguration::usable($command->gatewayConfigurationId);

        $candidates = $this->scope->discover($root, ShareBudget::forPreview($this->meter));
        $selection = $candidates->selection($command->selectedIds);
        $preview = SharePreview::create($owner->actorId(), $root, $selection, $configuration);

        return new SavedSharePreview($preview->id, $preview->checksum, $candidates);
    }
}
