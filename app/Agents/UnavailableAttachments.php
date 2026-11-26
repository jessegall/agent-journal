<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Drivers\Contracts\AttachmentReferences;
use App\Exceptions\DriverRequestRefused;
use App\Messages\Data\MessageAttachmentData;

/**
 * Without a domain that stores attachments, no attachment can be read, so a delivery that names one is refused.
 */
final readonly class UnavailableAttachments implements AttachmentReferences
{
    public function assertReadable(MessageAttachmentData $part, string $recipientSessionId): void
    {
        throw DriverRequestRefused::attachmentMissing($part->attachmentId);
    }
}
