<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\RefreshShareScope;

use Domain\Sharing\Commands\Support\SharingCommandHandler;
use Domain\Sharing\Support\ShareGrants;
use Domain\Sharing\Support\ShareSummary;

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
