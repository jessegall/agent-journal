<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The chat window: the sessions the user can talk to and the open conversation, when one is chosen.
 */
#[TypeScript]
final class ChatData extends Data
{
    /**
     * @param  list<SessionOptionData>  $sessions
     */
    public function __construct(
        #[DataCollectionOf(SessionOptionData::class)] public readonly array $sessions,
        public readonly ConversationData|Optional $conversation = new Optional(),
    ) {}
}
