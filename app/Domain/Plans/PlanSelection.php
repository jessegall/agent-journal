<?php

declare(strict_types=1);

namespace App\Domain\Plans;

/**
 * The plan selected for reading: none asked for, one found (inside the current filter or not), or one that cannot be
 * read, which carries no title.
 */
final readonly class PlanSelection
{
    private function __construct(
        public ?PlanCard $card,
        public bool $wasAskedFor,
        public bool $isInsideFilter,
    ) {}

    public static function none(): self
    {
        return new self(null, false, false);
    }

    public static function missing(): self
    {
        return new self(null, true, false);
    }

    public static function found(PlanCard $card, bool $isInsideFilter): self
    {
        return new self($card, true, $isInsideFilter);
    }

    public function isMissing(): bool
    {
        return $this->wasAskedFor && $this->card === null;
    }
}
