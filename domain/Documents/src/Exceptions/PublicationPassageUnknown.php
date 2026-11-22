<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use LogicException;

/**
 * A passage id that names no revision and line, so no passage can be opened from it.
 */
final class PublicationPassageUnknown extends LogicException
{
    public static function for(string $id): self
    {
        return new self("The passage id {$id} names no revision and line of a published text.");
    }
}
