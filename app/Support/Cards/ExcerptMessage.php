<?php

declare(strict_types=1);

namespace App\Support\Cards;

use App\Exceptions\DockCardInvalid;
use DateTimeImmutable;
use DateTimeInterface;
use JsonSerializable;

/**
 * One message in a chat excerpt: who wrote it, when, and the start of its text as plain words.
 */
final readonly class ExcerptMessage implements JsonSerializable
{
    public const int PREVIEW_CHARACTER_LIMIT = 280;

    public function __construct(public string $speaker, public DateTimeImmutable $sentAt, public string $preview)
    {
        if (mb_strlen($preview) > self::PREVIEW_CHARACTER_LIMIT) {
            throw DockCardInvalid::tooMuchText($speaker, self::PREVIEW_CHARACTER_LIMIT);
        }
    }

    public function jsonSerialize(): mixed
    {
        return [
            'speaker' => $this->speaker,
            'sentAt' => $this->sentAt->format(DateTimeInterface::ATOM),
            'preview' => $this->preview,
        ];
    }
}
