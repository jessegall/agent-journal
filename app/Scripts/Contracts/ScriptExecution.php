<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

use App\Profiles\Values\NamedCommand;
use App\Scripts\Values\BooleanOperand;
use App\Scripts\Values\StepOutcome;

interface ScriptExecution
{
    public function run(NamedCommand $command): StepOutcome;

    public function check(BooleanOperand $condition): StepOutcome;

    public function branch(BooleanOperand $condition): StepOutcome;

    public function yieldToActor(string $guidance): StepOutcome;

    public function recordEvidence(string $text): StepOutcome;
}
