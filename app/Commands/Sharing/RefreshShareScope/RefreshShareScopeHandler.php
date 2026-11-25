<?php

declare(strict_types=1);

namespace App\Commands\Sharing\RefreshShareScope;

use App\Contracts\Bus\CommandHandler;
use App\Support\ShareGrants;
use App\Support\ShareSummary;

final readonly class RefreshShareScopeHandler implements CommandHandler
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
