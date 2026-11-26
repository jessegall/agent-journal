<?php

declare(strict_types=1);

namespace App\Sharing\Commands\SaveSharePreview;

use App\Access\Contracts\SharePolicy;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\SharePreview;
use App\Reads\Contracts\ReadMeter;
use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Support\SavedSharePreview;
use App\Sharing\Support\ShareBudget;
use App\Sharing\Support\ShareScope;
use App\Support\RecordIdentity;

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
            ? ShareGatewayConfiguration::findUsableDefault()
            : ShareGatewayConfiguration::findUsable($command->gatewayConfigurationId);

        $candidates = $this->scope->discover($root, ShareBudget::forPreview($this->meter));
        $selection = $candidates->selection($command->selectedIds);
        $preview = SharePreview::create($owner->actorId(), $root, $selection, $configuration);

        return new SavedSharePreview($preview->id, $preview->checksum, $candidates);
    }
}
