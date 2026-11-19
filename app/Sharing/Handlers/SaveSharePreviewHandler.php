<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use App\Reads\Contracts\ReadMeter;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\SaveSharePreview;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Enums\SharingAbility;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\SharePreview;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\MeteredShareBudget;
use App\Sharing\Support\SavedSharePreview;
use App\Sharing\Support\ShareScope;

final readonly class SaveSharePreviewHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private CurrentActor $actors,
        private SharePolicy $policy,
        private ShareScope $scope,
        private ReadMeter $meter,
    ) {}

    public function handle(SaveSharePreview $command): SavedSharePreview
    {
        $this->authorizer->authorize(SharingPolicy::class, Share::class, SharingAbility::Administer);
        $owner = $this->actors->actor();
        $this->policy->requireManager($owner);
        $root = new RecordIdentity($command->rootType, $command->rootId);
        $configuration = $command->gatewayConfigurationId === null
            ? ShareGatewayConfiguration::usableDefault()
            : ShareGatewayConfiguration::usable($command->gatewayConfigurationId);
        $candidates = $this->scope->discover($root, MeteredShareBudget::forPreview($this->meter));
        $preview = SharePreview::createFor($owner->actorId(), $root, $candidates->selection($command->selectedIds), $configuration);

        return new SavedSharePreview($preview->id, $preview->checksum, $candidates);
    }
}
