<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Enums\MessageState;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One row of a chat as the window shows it: its id and timeline position, the user message it belongs under when
 * visible, who wrote it and whom it addresses, what it replies to, its text and state, whether the viewer has
 * been shown it and, for its author or an operator, how far each woken recipient got.
 */
#[TypeScript]
final class ChatMessageData extends Data
{
    /**
     * @param  list<DeliveryData>  $deliveries
     */
    public function __construct(
        public readonly string $id,
        public readonly int $sequence,
        public readonly string|null $rootId,
        public readonly SpeakerData $speaker,
        public readonly string|null $addressedTo,
        public readonly ReplyTargetData|null $replyTo,
        public readonly string $body,
        public readonly MessageState $state,
        public readonly int $stateVersion,
        public readonly string|null $respondent,
        public readonly QuestionActionsData $actions,
        public readonly bool $readByMe,
        public readonly string $sentAt,
        // The key the viewer posted this row under; only its own author sees it, so a send settles on it.
        public readonly string|null $requestKey,
        #[DataCollectionOf(DeliveryData::class)]
        public readonly array $deliveries = [],
    ) {}
}
