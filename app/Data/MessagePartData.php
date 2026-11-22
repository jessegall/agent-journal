<?php

declare(strict_types=1);

namespace App\Data;

use App\Contracts\Drivers\MessagePart;
use App\Enums\MessagePartType;
use Spatie\LaravelData\Data;

/**
 * A message part as it is stored on a delivery and sent to the host: a text, or an attachment by its id, digest and
 * label. It fills itself from its stored array.
 */
final class MessagePartData extends Data implements MessagePart
{
    public function __construct(
        public readonly MessagePartType $type,
        public readonly string $text,
        public readonly string $attachmentId,
        public readonly string $digest,
        public readonly string $label,
    ) {}

    public static function forText(string $text): self
    {
        return new self(MessagePartType::Text, $text, '', '', '');
    }

    public static function forAttachment(string $attachmentId, string $digest, string $label): self
    {
        return new self(MessagePartType::Attachment, '', $attachmentId, $digest, $label);
    }

    /**
     * The parts as stored or sent.
     *
     * @param  list<array<string, mixed>>  $stored
     * @return list<MessagePart>
     */
    public static function listOf(array $stored): array
    {
        return array_values(self::collect($stored));
    }

    public function type(): MessagePartType
    {
        return $this->type;
    }

    public function text(): string
    {
        return $this->text;
    }

    public function attachmentId(): string
    {
        return $this->attachmentId;
    }

    public function digest(): string
    {
        return $this->digest;
    }

    public function label(): string
    {
        return $this->label;
    }

    public function isAttachment(): bool
    {
        return $this->type === MessagePartType::Attachment;
    }
}
