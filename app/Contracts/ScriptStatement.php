<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\CompileContext;
use App\Values\FlowShape;
use App\Values\Instruction;
use App\Values\ParsedStatement;
use App\Values\RunContext;
use App\Values\StepOutcome;

interface ScriptStatement
{
    public function compile(ParsedStatement $statement, CompileContext $context): Instruction;

    public function execute(Instruction $instruction, RunContext $context): StepOutcome;

    public function flow(): FlowShape;
}
