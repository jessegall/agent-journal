<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * One input a browser writer sends through their grant: text, Enter after it or both, at its sequence and for the
 * screen revision the writer saw when they typed it.
 */
final readonly class TerminalInput
{
    public function __construct(
        public string $text,
        public bool $enter,
        public int $sequence,
        public int $screenRevision,
    ) {}
}
