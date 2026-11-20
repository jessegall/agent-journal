<?php

declare(strict_types=1);

namespace App\Scripts\Values;

/**
 * What reading one member of a script object gave: its value, a read the host has not answered yet (with the reference
 * the suspended instruction resumes on), or a diagnostic. A failed read is never a value such as false.
 */
final readonly class ObjectRead
{
    private function __construct(
        public bool|int|string|null $value,
        public string|null $pendingReference,
        public string|null $diagnostic,
    ) {}

    public static function value(bool|int|string $value): self
    {
        return new self($value, null, null);
    }

    public static function pending(string $reference): self
    {
        return new self(null, $reference, null);
    }

    public static function failed(string $diagnostic): self
    {
        return new self(null, null, $diagnostic);
    }

    public function isPending(): bool
    {
        return $this->pendingReference !== null;
    }

    public function hasFailed(): bool
    {
        return $this->diagnostic !== null;
    }
}
