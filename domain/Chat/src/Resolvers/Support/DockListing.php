<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers\Support;

use App\Models\Inboxes\Inbox;
use App\Support\Wire\EncodedCard;
use Domain\Chat\Data\DockedSourceData;
use Domain\Chat\Data\DockListData;
use Domain\Chat\Enums\DockedStatus;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockProjection;

/**
 * The placements of one chat for a journal or MCP caller: type, source, title and state, never a card's
 * body, a nested chat or an action. A source the caller may not read shows no title.
 */
final readonly class DockListing
{
    public function __construct(private DockProjection $projection) {}

    public function of(Inbox $inbox, int $limit): DockListData
    {
        $page = $this->projection->page($inbox, null, $limit);
        $shown = [];

        foreach ($page->cards as $card) {
            $shown[$card->placementId] = $card;
        }

        $placements = DockPlacement::query()
            ->inInbox($inbox)
            ->byAssignedAt()
            ->readExactly($limit + 1)
            ->get();

        $listed = $placements->take($limit)->map(
            fn (DockPlacement $placement) => self::listed($placement, $shown[$placement->id] ?? null),
        );

        return DockListData::from([
            'inboxId' => $inbox->id,
            'placements' => array_values($listed->all()),
            'hasMore' => $placements->count() > $limit,
        ]);
    }

    private static function listed(DockPlacement $placement, EncodedCard|null $card): DockedSourceData
    {
        return DockedSourceData::from([
            'placementId' => $placement->id,
            'type' => $placement->dockable_type,
            'sourceId' => $placement->dockable_id,
            'title' => $card === null ? '' : $card->accessibleName,
            'status' => $card === null ? DockedStatus::Unavailable : DockedStatus::Shown,
        ]);
    }
}
