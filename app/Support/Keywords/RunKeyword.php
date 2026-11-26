<?php

declare(strict_types=1);

namespace App\Support\Keywords;

use App\Contracts\Scripts\ScriptStatement;
use App\Enums\CommandRules\SyntaxForm;
use App\Support\CompileContext;
use App\Values\FlowShape;
use App\Values\Instruction;
use App\Values\ParsedStatement;
use App\Values\RunContext;
use App\Values\ScriptKeywordDefinition;
use App\Values\StepOutcome;

final readonly class RunKeyword implements ScriptStatement
{
    public static function definition(): ScriptKeywordDefinition
    {
        return ScriptKeywordDefinition::statement('RUN', SyntaxForm::CommandKey, self::class, 'Run one activated command.');
    }

    public function compile(ParsedStatement $statement, CompileContext $context): Instruction
    {
        return $context->command($statement);
    }

    public function execute(Instruction $instruction, RunContext $context): StepOutcome
    {
        return $context->execution->run($instruction->command());
    }

    public function flow(): FlowShape
    {
        return FlowShape::action(['passed', 'failure']);
    }
}
