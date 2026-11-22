<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of messages, oldest first, with the cursor of the next older page when there is one.
 */
#[TypeScript]
final class MessagePage extends Data
{
    public const int DEFAULT_LIMIT = 50;

    public const int LARGEST_LIMIT = 100;

    /**
     * @param  list<MessageView>  $messages
     */
    public function __construct(
        #[DataCollectionOf(MessageView::class)]
        public readonly array $messages,
        public readonly string|null $olderCursor,
    ) {}
}
