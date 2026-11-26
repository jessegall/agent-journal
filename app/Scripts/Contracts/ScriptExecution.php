<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

use App\Values\BooleanOperand;
use App\Values\NamedCommand;
use App\Values\StepOutcome;

interface ScriptExecution
{
    /**
     * Runs the named command the script calls for.
     */
    public function run(NamedCommand $command): StepOutcome;

    /**
     * Evaluates the condition the script requires, and stops the run when it does not hold.
     */
    public function check(BooleanOperand $condition): StepOutcome;

    /**
     * Evaluates the condition so the script takes one of its branches.
     */
    public function branch(BooleanOperand $condition): StepOutcome;

    /**
     * Hands the run to the actor with the guidance, and waits for it to go on.
     */
    public function yieldToActor(string $guidance): StepOutcome;

    /**
     * Keeps the text as evidence of the step the script reached.
     */
    public function recordEvidence(string $text): StepOutcome;
}
