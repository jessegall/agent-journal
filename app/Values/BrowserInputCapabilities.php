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
        public bool $isText,
        public bool $keys,
        public bool $shouldPaste,
        public bool $shouldResize,
        public bool $isPrivateEntry,
    ) {}

    public static function none(): self
    {
        return new self(false, false, false, false, false);
    }

    public function carriesOut(TerminalInputType $type): bool
    {
        return match ($type) {
            TerminalInputType::Text => $this->isText,
            TerminalInputType::Key => $this->isText && $this->keys,
            TerminalInputType::Paste => $this->isText && $this->shouldPaste,
            TerminalInputType::Resize => $this->isText && $this->shouldResize,
            TerminalInputType::Private => $this->isText && $this->isPrivateEntry,
        };
    }
}
