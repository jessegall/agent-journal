<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\SkillKeyInvalid;
use App\Text\StableKey;

/**
 * The stable name of a skill, such as journal-plans. journal- keys belong to first-party shipped skills and user- keys
 * to skills users store; a module prefixes its keys with its package slug.
 */
final readonly class SkillKey
{
    private const string FIRST_PARTY_PREFIX = 'journal-';

    private const string USER_PREFIX = 'user-';

    private function __construct(
        public string $key,
    ) {}

    public static function from(string $text): self
    {
        if (! StableKey::isValid($text)) {
            throw SkillKeyInvalid::for($text);
        }

        return new self($text);
    }

    public function isFirstParty(): bool
    {
        return str_starts_with($this->key, self::FIRST_PARTY_PREFIX);
    }

    public function isUserAuthored(): bool
    {
        return str_starts_with($this->key, self::USER_PREFIX);
    }

    public function hasPrefix(string $slug): bool
    {
        return str_starts_with($this->key, $slug.'-');
    }

    public function __toString(): string
    {
        return $this->key;
    }
}
