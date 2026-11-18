<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Contracts\CommandHandler;
use App\Sharing\Actions\ShareGrants;
use App\Sharing\Commands\RefreshShareScope;
use App\Sharing\Support\ShareSummary;

final readonly class RefreshShareScopeHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors, private ShareGrants $grants) {}

    public function handle(RefreshShareScope $command): ShareSummary
    {
        return $this->grants->refresh($this->actors->actor(), $command->shareId, $command->previewId, $command->previewChecksum)->summary();
    }
}
