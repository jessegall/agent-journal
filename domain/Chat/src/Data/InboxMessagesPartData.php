<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Data\MessageView;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of one inbox's newest messages, a native part of the Inbox page: the inbox they sit in and the bounded
 * slice of its messages, which live changes replace in place.
 */
#[TypeScript]
final class InboxMessagesPartData extends Data
{
    /**
     * @param  list<MessageView>  $messages
     */
    public function __construct(
        public readonly string $inboxId,
        #[DataCollectionOf(MessageView::class)]
        public readonly array $messages,
    ) {}
}
