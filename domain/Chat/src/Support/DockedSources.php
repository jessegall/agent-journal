<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use Domain\Chat\Contracts\Docking\DockedSources as DockedSourcesContract;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\Cards\DockIdentity;

/**
 * A source is docked while some chat holds a placement of it.
 */
final readonly class DockedSources implements DockedSourcesContract
{
    private const int INBOX_LIMIT = 100;

    public function isDocked(DockIdentity $source): bool
    {
        return DockPlacement::query()->ofSource($source)->exists();
    }

    public function inboxesDocking(DockIdentity $source): array
    {
        return array_values(array_map(strval(...), DockPlacement::query()
            ->ofSource($source)
            ->limit(self::INBOX_LIMIT)
            ->pluck('inbox_id')
            ->all()));
    }
}
