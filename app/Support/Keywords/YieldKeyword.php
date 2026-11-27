<?php

declare(strict_types=1);

namespace App\Support\Keywords;

use App\CommandRules\Enums\SyntaxForm;
use App\Scripts\CompileContext;
use App\Scripts\Contracts\ScriptStatement;
use App\Scripts\Values\FlowShape;
use App\Scripts\Values\Instruction;
use App\Scripts\Values\ParsedStatement;
use App\Scripts\Values\RunContext;
use App\Values\ScriptKeywordDefinition;
use App\Values\StepOutcome;

final readonly class YieldKeyword implements ScriptStatement
{
    public static function definition(): ScriptKeywordDefinition
    {
        return ScriptKeywordDefinition::statement(
            'YIELD',
            SyntaxForm::Text,
            self::class,
            'Return guidance to the actor.',
        );
    }

    public function compile(ParsedStatement $statement, CompileContext $context): Instruction
    {
        return $context->yieldToActor($statement);
    }

    public function execute(Instruction $instruction, RunContext $context): StepOutcome
    {
        return $context->execution->yieldToActor($instruction->text());
    }

    public function flow(): FlowShape
    {
        return FlowShape::action(['returned']);
    }
}
