<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\DriverKeyInvalid;

/**
 * The stable name of an agent driver, such as claude-code or codex, as its registration gives it; a third-party driver
 * names its vendor first, such as acme/reader.
 */
final readonly class DriverKey
{
    public const int CHARACTER_LIMIT = 128;

    private const string PATTERN = '~^[a-z0-9]+(-[a-z0-9]+)*(/[a-z0-9]+(-[a-z0-9]+)*)?$~D';

    private function __construct(
        public string $key,
    ) {}

    public static function from(string $text): self
    {
        if (strlen($text) > self::CHARACTER_LIMIT || preg_match(self::PATTERN, $text) !== 1) {
            throw DriverKeyInvalid::for($text);
        }

        return new self($text);
    }

    /**
     * Whether a package outside the journal registered the driver, its key named under the package's own name, such
     * as acme/reader; such a driver runs only once the owner approved it.
     */
    public function isThirdParty(): bool
    {
        return str_contains($this->key, '/');
    }

    public function isSameAs(self $other): bool
    {
        return $this->key === $other->key;
    }

    public function __toString(): string
    {
        return $this->key;
    }
}
