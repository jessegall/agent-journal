<?php

declare(strict_types=1);

namespace App\Sharing\Commands\SaveSharePreview;

use App\Contracts\CommandHandler;
use App\Reads\Contracts\ReadMeter;
use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\SharePreview;
use App\Sharing\Support\MeteredShareBudget;
use App\Sharing\Support\SavedSharePreview;
use App\Sharing\Support\ShareScope;

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
