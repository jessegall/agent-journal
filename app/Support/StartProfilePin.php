<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The authorization profile a start was pinned to: its key and the revision in force at start.
 */
final readonly class StartProfilePin
{
    public function __construct(public string $key, public int $revision) {}
}
