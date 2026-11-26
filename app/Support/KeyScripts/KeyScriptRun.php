<?php

declare(strict_types=1);

namespace App\Support\KeyScripts;

/**
 * Where one run of a key script stands: the step in hand, the run's values, when that step began by the host's clock,
 * and the highlighted entry a sent arrow must move away from before the next key. It is saved between frames, so a
 * replaced worker goes on from the last answered step.
 */
final readonly class KeyScriptRun
{
    /**
     * @param  array<string, string>  $values
     */
    public function __construct(
        public KeyScript $script,
        public array $values,
        public int $step = 0,
        public int|null $stepBegan = null,
        public string|null $highlightBefore = null,
    ) {}

    public function currentStep(): KeyStep
    {
        return $this->script->steps[$this->step];
    }

    /**
     * Whether the run is on its script's last step.
     */
    public function isOnLastStep(): bool
    {
        return $this->step === count($this->script->steps) - 1;
    }

    public function isFinished(): bool
    {
        return $this->step >= count($this->script->steps);
    }

    /**
     * The run on its next step, which begins at the frame's time.
     */
    public function advanced(int $captured): self
    {
        return clone ($this, ['step' => $this->step + 1, 'stepBegan' => $captured, 'highlightBefore' => null]);
    }

    /**
     * The run that began its step at the frame's time, if it had not yet.
     */
    public function withStepStarted(int $captured): self
    {
        return clone ($this, ['stepBegan' => $this->stepBegan ?? $captured]);
    }

    /**
     * The run on the same step, waiting for the highlight to leave the entry an arrow was sent from; each arrow begins
     * the step's wait anew, as a key of its own.
     */
    public function awaitingMoveFrom(string $highlighted): self
    {
        return clone ($this, ['stepBegan' => null, 'highlightBefore' => $highlighted]);
    }

    /**
     * The run whose last arrow was drawn: the highlight left the entry it was sent from.
     */
    public function moved(): self
    {
        return clone ($this, ['highlightBefore' => null]);
    }

    /**
     * Whether the step's deadline passed by the frame's time.
     */
    public function isOverdue(int $captured): bool
    {
        return $this->stepBegan !== null && $captured - $this->stepBegan > KeyStep::DEADLINE_MS;
    }
}
