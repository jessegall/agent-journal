<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Contracts\CommandHandler;
use App\Reads\Contracts\ReadMeter;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\SaveSharePreview;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\SharePreview;
use App\Sharing\Support\SavedSharePreview;
use App\Sharing\Support\ShareBudget;
use App\Sharing\Support\ShareScope;

final readonly class SaveSharePreviewHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private SharePolicy $policy,
        private ShareScope $scope,
        private ReadMeter $meter,
    ) {}

    public function handle(SaveSharePreview $command): SavedSharePreview
    {
        $owner = $this->actors->actor();
        $this->policy->requireManager($owner);
        $root = new RecordIdentity($command->rootType, $command->rootId);
        $configuration = $command->gatewayConfigurationId === null
            ? ShareGatewayConfiguration::usableDefault()
            : ShareGatewayConfiguration::usable($command->gatewayConfigurationId);
        $candidates = $this->scope->discover($root, ShareBudget::forPreview($this->meter));
        $preview = SharePreview::createFor($owner->actorId(), $root, $candidates->selection($command->selectedIds), $configuration);

        return new SavedSharePreview($preview->id, $preview->checksum, $candidates);
    }
}
