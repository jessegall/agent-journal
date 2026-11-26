<?php

declare(strict_types=1);

namespace App\Terminals;

use App\Terminals\Enums\TerminalInputType;
use App\Terminals\Enums\TerminalNamedKey;

/**
 * One input a browser writer sends through their grant: text with or without Enter, one named key, a paste, or a
 * resize to rows and columns, at its sequence and for the screen revision the writer saw when they composed it.
 */
final readonly class TerminalInput
{
    /**
     * The most bytes one paste may carry.
     */
    public const int PASTE_BYTE_LIMIT = 16_384;

    public function __construct(
        public string $text,
        public bool $shouldEnter,
        public int $sequence,
        public int $screenRevision,
        public TerminalInputType $type = TerminalInputType::Text,
        public TerminalNamedKey|null $key = null,
        public int $rows = 0,
        public int $columns = 0,
    ) {}

    public function isOverPasteBound(): bool
    {
        return $this->type === TerminalInputType::Paste && strlen($this->text) > self::PASTE_BYTE_LIMIT;
    }
}
