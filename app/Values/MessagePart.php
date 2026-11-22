<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\MessagePartType;
use Spatie\LaravelData\Data;

/**
 * One part of a delivery to an agent, in its place among the others: a text, or an attachment named by its id, the
 * digest of the version sent and its label. The agent reads an attachment through the journal, never from a path.
 */
final class MessagePart extends Data
{
    public function __construct(
        public readonly MessagePartType $type,
        public readonly string $text,
        public readonly string $attachmentId,
        public readonly string $digest,
        public readonly string $label,
    ) {}

    public static function text(string $text): self
    {
        return new self(MessagePartType::Text, $text, '', '', '');
    }

    public static function attachment(string $attachmentId, string $digest, string $label): self
    {
        return new self(MessagePartType::Attachment, '', $attachmentId, $digest, $label);
    }

    /**
     * The parts as stored or sent.
     *
     * @param  list<array<string, mixed>>  $stored
     * @return list<self>
     */
    public static function listOf(array $stored): array
    {
        return array_values(self::collect($stored));
    }

    public function isAttachment(): bool
    {
        return $this->type === MessagePartType::Attachment;
    }
}
