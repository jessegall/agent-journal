<?php

declare(strict_types=1);

namespace App\Values;

/**
 * Which names a grant lets through: every one, or only those listed. A list may be empty and then admits none.
 */
final readonly class AllowedNames
{
    /**
     * @param  list<string>  $names
     */
    private function __construct(
        public bool $isRestricted,
        public array $names,
    ) {}

    public static function all(): self
    {
        return new self(false, []);
    }

    /**
     * @param  list<string>  $names
     */
    public static function only(array $names): self
    {
        return new self(true, array_values(array_unique($names)));
    }

    public function admits(string $name): bool
    {
        return ! $this->isRestricted || in_array($name, $this->names, true);
    }

    public function isRestricted(): bool
    {
        return $this->isRestricted;
    }

    /**
     * The listed names of a restricted grant; an unrestricted grant lists none, so ask isRestricted() first.
     *
     * @return list<string>
     */
    public function names(): array
    {
        return $this->names;
    }

    public function hasNoneAllowed(): bool
    {
        return $this->isRestricted && $this->names === [];
    }
}
