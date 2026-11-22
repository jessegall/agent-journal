<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\StopPreparationState;

/**
 * How preparing a stop came out: its state, what the actor is told, and whether the owner is told the work is held
 * (once, the first time it is).
 */
final readonly class StopPreparation
{
    private function __construct(
        public StopPreparationState $state,
        public string $message,
        public bool $tellsOwner,
    ) {}

    public static function preparing(string $message): self
    {
        return new self(StopPreparationState::Preparing, $message, false);
    }

    public static function finalChecks(): self
    {
        return new self(StopPreparationState::FinalChecks, '', false);
    }

    public static function returnToActor(string $message): self
    {
        return new self(StopPreparationState::ReturnToActor, $message, false);
    }

    public static function held(string $message, bool $tellsOwner): self
    {
        return new self(StopPreparationState::Held, $message, $tellsOwner);
    }
}
