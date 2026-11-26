<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

use App\Scripts\CompileContext;
use App\Scripts\Values\FlowShape;
use App\Scripts\Values\Instruction;
use App\Scripts\Values\ParsedStatement;
use App\Scripts\Values\RunContext;
use App\Values\StepOutcome;

interface ScriptStatement
{
    /**
     * The parsed statement compiled into the instruction a run follows.
     */
    public function compile(ParsedStatement $statement, CompileContext $context): Instruction;

    /**
     * Carries out the compiled instruction in the run.
     */
    public function execute(Instruction $instruction, RunContext $context): StepOutcome;

    /**
     * How the statement moves a run on: to the next step, to a branch, or to the end.
     */
    public function flow(): FlowShape;
}
