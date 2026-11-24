<?php

declare(strict_types=1);

namespace App\Enums;

use App\Contracts\Drivers\MessagePart;
use App\Data\Messages\MessageAttachmentData;
use App\Data\Messages\MessageTextData;

/**
 * What one part of a delivery holds: text, or a reference to an attachment the agent reads itself.
 */
enum MessagePartType: string
{
    case Text = 'text';
    case Attachment = 'attachment';

    /**
     * The part of this type from its stored array.
     *
     * @param  array<string, mixed>  $stored
     */
    public function partFrom(array $stored): MessagePart
    {
        return match ($this) {
            self::Text => MessageTextData::from($stored),
            self::Attachment => MessageAttachmentData::from($stored),
        };
    }
}
