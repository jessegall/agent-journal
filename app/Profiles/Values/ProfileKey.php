<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Exceptions\ProfileKeyInvalid;
use App\Text\Support\StableKey;

/**
 * The stable name of a profile, such as journal-reviewer: lowercase ASCII words joined by single hyphens, 1 to 64
 * characters, independent of the profile's label and record id.
 */
final readonly class ProfileKey
{
    private function __construct(
        public string $key,
    ) {}

    public static function from(string $text): self
    {
        if (! StableKey::isValid($text)) {
            throw ProfileKeyInvalid::for($text);
        }

        return new self($text);
    }

    public function __toString(): string
    {
        return $this->key;
    }
}
