<?php

declare(strict_types=1);

namespace App\Sharing\Commands\RefreshShareScope;

use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Support\ShareGrants;
use App\Sharing\Support\ShareSummary;

final readonly class RefreshShareScopeHandler extends SharingCommandHandler
{
    public function __construct(
        private ShareGrants $grants,
    ) {}

    public function handle(RefreshShareScopeCommand $command): ShareSummary
    {

        return $this->grants
            ->refresh($command->dispatchedBy(), $command->shareId, $command->previewId, $command->previewChecksum)
            ->summary;
    }
}
