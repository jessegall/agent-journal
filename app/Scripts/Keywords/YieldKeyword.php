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

final readonly class YieldKeyword implements ScriptStatement
{
    public static function definition(): KeywordDefinition
    {
        return KeywordDefinition::statement('YIELD', SyntaxForm::Text, self::class, 'Return guidance to the actor.');
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
