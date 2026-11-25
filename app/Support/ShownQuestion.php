<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Questions\Question;

/**
 * A question as its sender and its target are shown it, with the answer once there is one.
 */
final readonly class ShownQuestion
{
    /**
     * @param  list<string>  $options
     */
    public function __construct(
        public string $id,
        public string $inboxId,
        public string $senderType,
        public string $senderId,
        public string $targetType,
        public string $targetId,
        public string $text,
        public string $type,
        public array $options,
        public string|null $answer,
        public string|null $answeredAt,
        public string $askedAt,
    ) {}

    public static function of(Question $question): self
    {
        return new self(
            $question->id,
            $question->inbox_id,
            $question->sender_type,
            $question->sender_id,
            $question->target_type,
            $question->target_id,
            $question->text,
            $question->type->value,
            $question->options,
            $question->answer,
            $question->answered_at?->toIso8601String(),
            $question->created_at->toIso8601String(),
        );
    }
}
