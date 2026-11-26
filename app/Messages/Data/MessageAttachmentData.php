<?php

declare(strict_types=1);

namespace App\Messages\Data;

use App\Messages\Enums\MessagePartType;

/**
 * An attachment part of a message, by the uploaded file's id, its digest and its label, as it is stored on a delivery
 * and sent to the host.
 */
final class MessageAttachmentData extends MessagePartData
{
    /**
     * The journal tool an agent reads an attachment with.
     */
    private const string READ_TOOL = 'attachments_read';

    public function __construct(
        public readonly string $attachmentId,
        public readonly string $digest,
        public readonly string $label,
    ) {
        $this->type = MessagePartType::Attachment;
    }

    public function textBytes(): int
    {
        return 0;
    }

    public function promptLine(): string
    {
        $label = json_encode($this->label, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);

        return "Attachment {$label}: read it with the ".self::READ_TOOL." tool, attachment_id {$this->attachmentId}.";
    }
}
