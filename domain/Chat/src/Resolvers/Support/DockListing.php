<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers\Support;

use App\Support\Wire\EncodedCard;
use Domain\Chat\Data\DockedSourceData;
use Domain\Chat\Data\DockListData;
use Domain\Chat\Enums\DockedState;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockProjection;

/**
 * The placements of one conversation for a journal or MCP caller: type, source, title and state, never a card's
 * body, a nested chat or an action. A source the caller may not read shows no title.
 */
final readonly class DockListing
{
    public function __construct(private DockProjection $projection) {}

    public function of(Conversation $conversation, int $limit): DockListData
    {
        $page = $this->projection->page($conversation, null, $limit);
        $shown = [];

        foreach ($page->cards as $card) {
            $shown[$card->placementId] = $card;
        }

        $placements = DockPlacement::query()
            ->inConversation($conversation)
            ->orderBy('assigned_at')
            ->orderBy('id')
            ->readExactly($limit + 1)
            ->get();

        $listed = $placements->take($limit)->map(
            fn (DockPlacement $placement) => self::listed($placement, $shown[$placement->id] ?? null),
        );

        return DockListData::from([
            'conversationId' => $conversation->id,
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
            'state' => $card === null ? DockedState::Unavailable : DockedState::Shown,
        ]);
    }
}
