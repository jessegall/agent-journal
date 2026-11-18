<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

/**
 * How a close ended: the revision the document is now at, and whether the close published a new one.
 */
final readonly class CloseResult
{
    public function __construct(public int $revisionNumber, public bool $published) {}
}
