<?php

declare(strict_types=1);

namespace App\Scripts\Keywords;

use App\Scripts\Contracts\ScriptStatement;
use App\Scripts\Enums\SyntaxForm;
use App\Scripts\Support\CompileContext;
use App\Scripts\Values\FlowShape;
use App\Scripts\Values\Instruction;
use App\Scripts\Values\KeywordDefinition;
use App\Scripts\Values\ParsedStatement;
use App\Scripts\Values\RunContext;
use App\Scripts\Values\StepOutcome;

final readonly class RunKeyword implements ScriptStatement
{
    public static function definition(): KeywordDefinition
    {
        return KeywordDefinition::statement('RUN', SyntaxForm::CommandKey, self::class, 'Run one activated command.');
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
