<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\TerminalInputType;

/**
 * Which browser input a host's claim says it carries out on its terminals: text and Enter, named keys, pastes,
 * resizes and private entry, which only a driver with a proven private boundary offers. A host that says none is
 * watch-only.
 */
final readonly class BrowserInputCapabilities
{
    public function __construct(
        public bool $text,
        public bool $keys,
        public bool $paste,
        public bool $resize,
        public bool $privateEntry,
    ) {}

    public static function none(): self
    {
        return new self(false, false, false, false, false);
    }

    public function carriesOut(TerminalInputType $type): bool
    {
        return match ($type) {
            TerminalInputType::Text => $this->text,
            TerminalInputType::Key => $this->text && $this->keys,
            TerminalInputType::Paste => $this->text && $this->paste,
            TerminalInputType::Resize => $this->text && $this->resize,
            TerminalInputType::Private => $this->text && $this->privateEntry,
        };
    }
}
