<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * One named read a profile holds: the read's name and the one target it covers, or every target when none is named.
 */
final readonly class ScopedRead
{
    public function __construct(public string $name, public string|null $target = null) {}

    public function covers(string $name, string|null $target): bool
    {
        return $this->name === $name && ($this->target === null || $this->target === $target);
    }

    /**
     * @return array{name: string, target: string|null}
     */
    public function toArray(): array
    {
        return ['name' => $this->name, 'target' => $this->target];
    }

    /**
     * @param  array{name: string, target: string|null}  $fields
     */
    public static function fromArray(array $fields): self
    {
        return new self($fields['name'], $fields['target']);
    }
}
