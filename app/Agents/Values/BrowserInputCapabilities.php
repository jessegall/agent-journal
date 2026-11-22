<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\TerminalInputKind;

/**
 * Which browser input a host's claim says it carries out on its terminals: text and Enter, named keys, and pastes. A
 * host that says none is watch-only.
 */
final readonly class BrowserInputCapabilities
{
    public function __construct(
        public bool $text,
        public bool $keys,
        public bool $paste,
    ) {}

    public static function none(): self
    {
        return new self(false, false, false);
    }

    public function carriesOut(TerminalInputKind $kind): bool
    {
        return match ($kind) {
            TerminalInputKind::Text => $this->text,
            TerminalInputKind::Key => $this->text && $this->keys,
            TerminalInputKind::Paste => $this->text && $this->paste,
        };
    }
}
