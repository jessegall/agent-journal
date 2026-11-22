<?php

declare(strict_types=1);

namespace App\Drivers\Values;

use App\Drivers\Exceptions\DriverKeyInvalid;
use App\Text\Support\StableKey;

/**
 * The stable name of an agent driver, such as claude-code or codex, as its registration gives it.
 */
final readonly class DriverKey
{
    private function __construct(
        public string $key,
    ) {}

    public static function from(string $text): self
    {
        if (! StableKey::isValid($text)) {
            throw DriverKeyInvalid::for($text);
        }

        return new self($text);
    }

    public function __toString(): string
    {
        return $this->key;
    }
}
