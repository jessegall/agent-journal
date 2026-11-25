<?php

declare(strict_types=1);

namespace App\Data\Messages;

use App\Contracts\Drivers\MessagePart;
use App\Enums\Messages\MessagePartType;
use Spatie\LaravelData\Data;

/**
 * An attachment part of a message, by the uploaded file's id, its digest and its label, as it is stored on a delivery
 * and sent to the host.
 */
final class MessageAttachmentData extends Data implements MessagePart
{
    public function __construct(
        public readonly string $attachmentId,
        public readonly string $digest,
        public readonly string $label,
        public readonly MessagePartType $type = MessagePartType::Attachment,
    ) {}

    public function textBytes(): int
    {
        return 0;
    }
}
