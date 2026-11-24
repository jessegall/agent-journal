<?php

declare(strict_types=1);

namespace App\Contracts\Scripts;

use App\Support\CompileContext;
use App\Values\FlowShape;
use App\Values\Instruction;
use App\Values\ParsedStatement;
use App\Values\RunContext;
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
