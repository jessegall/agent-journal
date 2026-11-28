<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Agents\Enums\StopPreparationStatus;
use App\Values\AgentText;

/**
 * How preparing a stop came out: its state, what the actor is told, and whether the owner is told the work is held
 * (once, the first time it is).
 */
final readonly class StopPreparation
{
    private function __construct(
        public StopPreparationStatus $status,
        public AgentText $message,
        public bool $notifiesOwner,
    ) {}

    public static function preparing(): self
    {
        return new self(StopPreparationStatus::Preparing, AgentText::of('core.stop.script_waits'), false);
    }

    public static function finalChecks(): self
    {
        return new self(StopPreparationStatus::FinalChecks, AgentText::of('core.stop.checks_running'), false);
    }

    /**
     * The script sent the agent back with the evidence of its last step.
     */
    public static function returnToActor(string $evidence): self
    {
        return new self(
            StopPreparationStatus::ReturnToActor,
            AgentText::of('core.stop.script_returned', ['evidence' => $evidence]),
            false,
        );
    }

    /**
     * The work is held for repair for the reason given.
     */
    public static function held(string $reason, bool $notifiesOwner): self
    {
        return new self(
            StopPreparationStatus::Held,
            AgentText::of('core.stop.script_held', ['reason' => $reason]),
            $notifiesOwner,
        );
    }
}
