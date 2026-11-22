<?php

declare(strict_types=1);

namespace Domain\Plans\Values;

/**
 * The plan selected for reading: none asked for, one found with its brief (inside the current filter or not), or one
 * that cannot be read, which carries no title and no brief.
 */
final readonly class PlanSelection
{
    private function __construct(
        public PlanCard|null $card,
        public bool $wasRequested,
        public bool $isInsideFilter,
        public string $brief,
    ) {}

    public static function none(): self
    {
        return new self(null, false, false, '');
    }

    public static function missing(): self
    {
        return new self(null, true, false, '');
    }

    public static function found(PlanCard $card, bool $isInsideFilter, string $brief): self
    {
        return new self($card, true, $isInsideFilter, $brief);
    }

    public function isMissing(): bool
    {
        return $this->wasRequested && $this->card === null;
    }
}
