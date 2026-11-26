<?php

declare(strict_types=1);

namespace App\Messages\Enums;

use App\Messages\Data\MessageAttachmentData;
use App\Messages\Data\MessagePartData;
use App\Messages\Data\MessageTextData;

/**
 * What one part of a delivery holds: text, or a reference to an attachment the agent reads itself.
 */
enum MessagePartType: string
{
    case Text = 'text';
    case Attachment = 'attachment';

    /**
     * The Data class of a part of this type.
     *
     * @return class-string<MessagePartData>
     */
    public function dataClass(): string
    {
        return match ($this) {
            self::Text => MessageTextData::class,
            self::Attachment => MessageAttachmentData::class,
        };
    }
}
