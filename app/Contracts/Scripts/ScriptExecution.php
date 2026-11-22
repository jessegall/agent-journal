<?php

declare(strict_types=1);

namespace App\Contracts\Scripts;

use App\Values\BooleanOperand;
use App\Values\NamedCommand;
use App\Values\StepOutcome;

interface ScriptExecution
{
    public function run(NamedCommand $command): StepOutcome;

    public function check(BooleanOperand $condition): StepOutcome;

    public function branch(BooleanOperand $condition): StepOutcome;

    public function yieldToActor(string $guidance): StepOutcome;

    public function recordEvidence(string $text): StepOutcome;
}
