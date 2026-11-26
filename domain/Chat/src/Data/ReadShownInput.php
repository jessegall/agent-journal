<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The incoming messages a user deliberately read in one conversation: the ids the timeline showed, at most a page.
 */
#[TypeScript]
final class ReadShownInput extends Data
{
    /**
     * @param  list<string>  $messageIds
     */
    public function __construct(
        #[Ulid]
        public readonly string $inboxId,
        #[ArrayType, Min(1), Max(100)]
        public readonly array $messageIds,
        // The agent the chat was chosen by, or none for a chat chosen by its inbox, such as a group chat.
        #[Ulid]
        public readonly string|null $agent,
    ) {}
}
