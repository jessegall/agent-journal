<?php

declare(strict_types=1);

namespace App\Messages\Data;

use App\Messages\Enums\MessagePartType;

/**
 * A text part of a message, as it is stored on a delivery and sent to the host.
 */
final class MessageTextData extends MessagePartData
{
    public function __construct(public readonly string $text)
    {
        $this->type = MessagePartType::Text;
    }

    public function textBytes(): int
    {
        return strlen($this->text);
    }

    public function promptLine(): string
    {
        return $this->text;
    }
}
