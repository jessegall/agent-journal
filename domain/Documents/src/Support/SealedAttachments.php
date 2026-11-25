<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Contracts\Drivers\AttachmentReferences;
use App\Contracts\Sessions\SessionProvenance;
use App\Data\Messages\MessageAttachmentData;
use App\Exceptions\DriverRequestRefused;
use Domain\Documents\Exceptions\UploadExpired;
use Domain\Documents\Models\TextUpload;

/**
 * An attachment a delivery names is a sealed upload the recipient's session can read, not expired, at the digest the
 * delivery names. The recipient's every read checks its session again, so an expired upload is refused there too.
 */
final readonly class SealedAttachments implements AttachmentReferences
{
    public function __construct(private SessionProvenance $sessions) {}

    public function assertReadable(MessageAttachmentData $part, string $recipientSessionId): void
    {
        try {
            $upload = TextUpload::findSealedFor($this->sessions, $recipientSessionId, $part->attachmentId);
        } catch (UploadExpired $expired) {
            throw DriverRequestRefused::attachmentMissing($part->attachmentId, $expired);
        }

        if (! hash_equals($upload->digest, $part->digest)) {
            throw DriverRequestRefused::attachmentChanged($part->attachmentId);
        }
    }
}
