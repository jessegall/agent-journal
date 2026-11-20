<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

use App\Scripts\Support\CompileContext;
use App\Scripts\Values\FlowShape;
use App\Scripts\Values\Instruction;
use App\Scripts\Values\ParsedStatement;
use App\Scripts\Values\RunContext;
use App\Scripts\Values\StepOutcome;

interface ScriptStatement
{
    public function compile(ParsedStatement $statement, CompileContext $context): Instruction;

    public function execute(Instruction $instruction, RunContext $context): StepOutcome;

    public function flow(): FlowShape;
}
