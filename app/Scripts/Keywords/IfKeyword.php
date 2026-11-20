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

final readonly class IfKeyword implements ScriptStatement
{
    public static function definition(): KeywordDefinition
    {
        return KeywordDefinition::statement('IF', SyntaxForm::Block, self::class, 'Branch on a boolean member.');
    }

    public function compile(ParsedStatement $statement, CompileContext $context): Instruction
    {
        return $context->branch($statement);
    }

    public function execute(Instruction $instruction, RunContext $context): StepOutcome
    {
        return $context->execution->branch($instruction->condition());
    }

    public function flow(): FlowShape
    {
        return FlowShape::branch(['true', 'false', 'failure']);
    }
}
