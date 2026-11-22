<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\ProviderKeyInvalid;
use App\Support\StableKey;

/**
 * The stable name of the provider family a driver runs on, such as anthropic or openai; never an account.
 */
final readonly class ProviderKey
{
    private function __construct(
        public string $key,
    ) {}

    public static function from(string $text): self
    {
        if (! StableKey::isValid($text)) {
            throw ProviderKeyInvalid::for($text);
        }

        return new self($text);
    }

    public function __toString(): string
    {
        return $this->key;
    }
}
