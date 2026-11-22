<?php

declare(strict_types=1);

namespace App\Support\Keywords;

use App\Contracts\Scripts\ScriptStatement;
use App\Enums\SyntaxForm;
use App\Support\CompileContext;
use App\Values\FlowShape;
use App\Values\Instruction;
use App\Values\KeywordDefinition;
use App\Values\ParsedStatement;
use App\Values\RunContext;
use App\Values\StepOutcome;

final readonly class ConditionalKeyword implements ScriptStatement
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
