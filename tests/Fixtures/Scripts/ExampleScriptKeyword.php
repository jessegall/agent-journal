<?php

declare(strict_types=1);

namespace Tests\Fixtures\Scripts;

use App\CommandRules\Enums\SyntaxForm;
use App\Profiles\Enums\ScriptEffect;
use App\Scripts\CompileContext;
use App\Scripts\Contracts\ScriptStatement;
use App\Scripts\Values\FlowShape;
use App\Scripts\Values\Instruction;
use App\Scripts\Values\ParsedStatement;
use App\Scripts\Values\RunContext;
use App\Values\ScriptKeywordDefinition;
use App\Values\StepOutcome;

final readonly class ExampleScriptKeyword implements ScriptStatement
{
    public static function definition(): ScriptKeywordDefinition
    {
        return ScriptKeywordDefinition::statement(
            'NOTE',
            SyntaxForm::Text,
            self::class,
            'Retain text in this run.',
            [ScriptEffect::RunEvidence],
        );
    }

    public function compile(ParsedStatement $statement, CompileContext $context): Instruction
    {
        return $context->textAction($statement);
    }

    public function execute(Instruction $instruction, RunContext $context): StepOutcome
    {
        return $context->execution->recordEvidence($instruction->text());
    }

    public function flow(): FlowShape
    {
        return FlowShape::action(['passed', 'failure']);
    }
}
