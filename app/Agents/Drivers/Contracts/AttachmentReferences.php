<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Exceptions\DriverRequestRefused;
use App\Messages\Data\MessageAttachmentData;

/**
 * Checks that the session a delivery goes to can read the attachment it names, at the version it names, before the
 * delivery is accepted.
 */
interface AttachmentReferences
{
    /**
     * @throws DriverRequestRefused
     */
    public function assertReadable(MessageAttachmentData $part, string $recipientSessionId): void;
}
