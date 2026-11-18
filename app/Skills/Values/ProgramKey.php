<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Skills\Exceptions\ProgramKeyInvalid;
use App\Text\Support\StableKey;

/**
 * The stable name of an agent program, such as claude-code or codex, as its registration gives it.
 */
final readonly class ProgramKey
{
    private function __construct(
        public string $key,
    ) {}

    public static function from(string $text): self
    {
        if (! StableKey::isValid($text)) {
            throw ProgramKeyInvalid::for($text);
        }

        return new self($text);
    }

    public function __toString(): string
    {
        return $this->key;
    }
}
