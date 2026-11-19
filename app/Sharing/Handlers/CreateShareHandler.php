<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use App\Sharing\Actions\ShareGrants;
use App\Sharing\Commands\CreateShare;
use App\Sharing\Enums\SharingAbility;
use App\Sharing\Models\Share;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\ShareDuration;
use App\Sharing\Support\ShareSummary;

final readonly class CreateShareHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private CurrentActor $actors,
        private ShareGrants $grants,
    ) {}

    public function handle(CreateShare $command): ShareSummary
    {
        $this->authorizer->authorize(SharingPolicy::class, Share::class, SharingAbility::Administer);
        $duration = ShareDuration::of($command->minutesUntilExpiry);

        return $this->grants->create($this->actors->actor(), $command->previewId, $command->previewChecksum, $duration)->summary();
    }
}
