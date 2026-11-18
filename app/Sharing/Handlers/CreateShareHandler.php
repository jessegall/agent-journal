<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Contracts\CommandHandler;
use App\Sharing\Actions\ShareGrants;
use App\Sharing\Commands\CreateShare;
use App\Sharing\Support\ShareDuration;
use App\Sharing\Support\ShareSummary;

final readonly class CreateShareHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors, private ShareGrants $grants) {}

    public function handle(CreateShare $command): ShareSummary
    {
        $duration = ShareDuration::of($command->minutesUntilExpiry);

        return $this->grants->create($this->actors->actor(), $command->previewId, $command->previewChecksum, $duration)->summary();
    }
}
