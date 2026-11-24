<?php

declare(strict_types=1);

namespace App\Data\Questions;

use App\Models\Questions\Question;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

/**
 * A question as its sender and its target read it, with the answer once there is one.
 */
final class QuestionView extends Data
{
    /**
     * @param  list<string>  $options
     */
    public function __construct(
        public readonly string $id,
        public readonly string $inboxId,
        public readonly string $senderType,
        public readonly string $senderId,
        public readonly string $targetType,
        public readonly string $targetId,
        public readonly string $text,
        public readonly string $type,
        public readonly array $options,
        public readonly string|null $answer,
        public readonly CarbonImmutable|null $answeredAt,
        public readonly CarbonImmutable $askedAt,
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
            $question->answered_at,
            $question->created_at,
        );
    }
}
