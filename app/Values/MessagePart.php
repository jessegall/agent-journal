<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\MessagePartType;
use JsonSerializable;

/**
 * One part of a delivery to an agent, in its place among the others: a text, or an attachment named by its id, the
 * digest of the version sent and its label. The agent reads an attachment through the journal, never from a path.
 */
final readonly class MessagePart implements JsonSerializable
{
    private function __construct(
        public MessagePartType $type,
        public string $text,
        public string $attachmentId,
        public string $digest,
        public string $label,
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
     * @param  list<array{type: string, text: string, attachmentId: string, digest: string, label: string}>  $stored
     * @return list<self>
     */
    public static function listOf(array $stored): array
    {
        return array_map(
            fn (array $part): self => new self(
                MessagePartType::from($part['type']),
                $part['text'],
                $part['attachmentId'],
                $part['digest'],
                $part['label'],
            ),
            $stored,
        );
    }

    public function isAttachment(): bool
    {
        return $this->type === MessagePartType::Attachment;
    }

    /**
     * @return array{type: string, text: string, attachmentId: string, digest: string, label: string}
     */
    public function toArray(): array
    {
        return [
            'type' => $this->type->value,
            'text' => $this->text,
            'attachmentId' => $this->attachmentId,
            'digest' => $this->digest,
            'label' => $this->label,
        ];
    }

    /**
     * @return array{type: string, text: string, attachmentId: string, digest: string, label: string}
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
