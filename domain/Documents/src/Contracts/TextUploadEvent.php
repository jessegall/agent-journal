<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a text upload: every event of it implements this, so a listener typed on it hears them all.
 */
interface TextUploadEvent extends Event
{
    public string $uploadId { get; }
}
