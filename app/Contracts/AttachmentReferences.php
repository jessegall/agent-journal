<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\DriverRequestRefused;
use App\Values\MessagePart;

/**
 * Checks that the session a delivery goes to can read the attachment it names, at the version it names, before the
 * delivery is accepted.
 */
interface AttachmentReferences
{
    /**
     * @throws DriverRequestRefused
     */
    public function assertReadable(MessagePart $part, string $recipientSessionId): void;
}
