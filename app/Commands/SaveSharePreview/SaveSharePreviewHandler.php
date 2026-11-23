<?php

declare(strict_types=1);

namespace App\Commands\SaveSharePreview;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Reads\ReadMeter;
use App\Contracts\Sharing\SharePolicy;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\SharePreview;
use App\Support\MeteredShareBudget;
use App\Support\RecordIdentity;
use App\Support\SavedSharePreview;
use App\Support\ShareScope;

final readonly class SaveSharePreviewHandler implements CommandHandler
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

        $candidates = $this->scope->discover($root, MeteredShareBudget::forPreview($this->meter));
        $selection = $candidates->selection($command->selectedIds);
        $preview = SharePreview::create($owner->actorId(), $root, $selection, $configuration);

        return new SavedSharePreview($preview->id, $preview->checksum, $candidates);
    }
}
