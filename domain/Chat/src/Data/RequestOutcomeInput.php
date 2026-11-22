<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Communication\Commands\PostChatMessage;
use App\Communication\Commands\ReplyInChat;
use Domain\Chat\Enums\SentOperation;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredIf;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Which request the browser asks about: its key, whether it was a send or a reply, and what it was meant for, the
 * pair of inboxes of a send or the message a reply answers.
 */
#[TypeScript]
final class RequestOutcomeInput extends Data
{
    public function __construct(
        #[Max(128)]
        public readonly string $requestKey,
        public readonly SentOperation $operation,
        #[Ulid, RequiredIf('operation', 'send')]
        public readonly string|null $inboxId = null,
        #[Ulid, RequiredIf('operation', 'reply')]
        public readonly string|null $messageId = null,
    ) {}

    /**
     * What the request was meant for, as its receipt keeps it.
     */
    public function target(): string
    {
        return match ($this->operation) {
            SentOperation::Send => PostChatMessage::targetOf((string) $this->inboxId),
            SentOperation::Reply => ReplyInChat::targetOf((string) $this->messageId),
        };
    }

    /**
     * The message the caller must still see to be told about a reply: the one it answers. A send names none.
     */
    public function answeredMessageId(): string|null
    {
        return $this->operation === SentOperation::Reply ? $this->messageId : null;
    }
}
