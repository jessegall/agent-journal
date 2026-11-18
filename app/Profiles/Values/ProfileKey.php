<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Exceptions\ProfileKeyInvalid;

/**
 * The stable name of a profile, such as journal-reviewer: lowercase ASCII words joined by single hyphens, 1 to 64
 * characters, independent of the profile's label and record id.
 */
final readonly class ProfileKey
{
    private const string PATTERN = '/^[a-z0-9]+(-[a-z0-9]+)*$/D';

    private const int MOST_CHARACTERS = 64;

    private function __construct(
        public string $key,
    ) {}

    public static function from(string $text): self
    {
        if (strlen($text) > self::MOST_CHARACTERS || preg_match(self::PATTERN, $text) !== 1) {
            throw ProfileKeyInvalid::for($text);
        }

        return new self($text);
    }

    public function __toString(): string
    {
        return $this->key;
    }
}
