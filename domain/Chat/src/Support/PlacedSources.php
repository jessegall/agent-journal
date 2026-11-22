<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Support\Cards\DockIdentity;
use App\Support\Sources\Contracts\DockedSources;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DockPlacement;

/**
 * A source is docked while some conversation holds a placement of it.
 */
final readonly class PlacedSources implements DockedSources
{
    private const int INBOX_LIMIT = 100;

    public function isDocked(DockIdentity $source): bool
    {
        return DockPlacement::query()->ofSource($source)->exists();
    }

    public function inboxesDocking(DockIdentity $source): array
    {
        return array_values(array_map(strval(...), Conversation::query()
            ->whereIn('id', DockPlacement::query()->ofSource($source)->select('conversation_id'))
            ->limit(self::INBOX_LIMIT)
            ->pluck('inbox_id')
            ->all()));
    }
}
