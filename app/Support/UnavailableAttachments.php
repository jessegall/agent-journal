<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\AttachmentReferences;
use App\Contracts\MessagePart;
use App\Exceptions\DriverRequestRefused;

/**
 * Without a domain that stores attachments, no attachment can be read, so a delivery that names one is refused.
 */
final readonly class UnavailableAttachments implements AttachmentReferences
{
    public function assertReadable(MessagePart $part, string $recipientSessionId): void
    {
        throw DriverRequestRefused::attachmentMissing($part->attachmentId());
    }
}
