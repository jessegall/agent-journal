<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Data\Messages\ChatEventPage;
use App\Data\Messages\ChatEventView;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the window reads of a chat's timeline: the events after its cursor up to the watermark, or a fresh start at
 * the watermark, the cursor to continue from, and whether the reader's access ended.
 */
#[TypeScript]
final class ChatEventsPageData extends Data
{
    /**
     * @param  list<ChatEventData>  $events
     */
    public function __construct(
        public readonly bool $accessEnded,
        #[DataCollectionOf(ChatEventData::class)]
        public readonly array $events,
        public readonly string|null $cursor,
        public readonly int $watermark,
    ) {}

    public static function fromChatEventPage(ChatEventPage $page): self
    {
        return new self(
            $page->accessEnded,
            array_map(fn (ChatEventView $event) => ChatEventData::from($event), $page->events),
            $page->cursor,
            $page->watermark,
        );
    }
}
