<?php

declare(strict_types=1);

namespace App\Data\Messages;

use App\Contracts\Drivers\MessagePart;
use App\Enums\MessagePartType;
use Spatie\LaravelData\Data;

/**
 * A text part of a message, as it is stored on a delivery and sent to the host.
 */
final class MessageTextData extends Data implements MessagePart
{
    public function __construct(
        public readonly string $text,
        public readonly MessagePartType $type = MessagePartType::Text,
    ) {}

    public function textBytes(): int
    {
        return strlen($this->text);
    }
}
