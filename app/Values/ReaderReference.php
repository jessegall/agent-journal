<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The reader a check's output is read with: a proven reader revision, or the state that no reader is proven yet, in
 * which case the check needs one before it may run normally.
 */
final readonly class ReaderReference
{
    private function __construct(public string $revision) {}

    public static function proven(string $revision): self
    {
        return new self($revision);
    }

    public static function required(): self
    {
        return new self('');
    }

    /**
     * The reference as it is stored again: its revision, or empty when no reader is proven yet.
     */
    public static function stored(string $revision): self
    {
        return new self($revision);
    }

    public function isProven(): bool
    {
        return $this->revision !== '';
    }

    public function label(): string
    {
        if ($this->isProven()) {
            return "reader {$this->revision}";
        }

        return 'reader required';
    }
}
