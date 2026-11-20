<?php

declare(strict_types=1);

namespace Tests\Fixtures\Scripts;

use App\Scripts\Contracts\ScriptStatement;
use App\Scripts\Enums\ScriptEffect;
use App\Scripts\Enums\SyntaxForm;
use App\Scripts\Support\CompileContext;
use App\Scripts\Values\FlowShape;
use App\Scripts\Values\Instruction;
use App\Scripts\Values\KeywordDefinition;
use App\Scripts\Values\ParsedStatement;
use App\Scripts\Values\RunContext;
use App\Scripts\Values\StepOutcome;

final readonly class ExampleScriptKeyword implements ScriptStatement
{
    public static function definition(): KeywordDefinition
    {
        return KeywordDefinition::statement(
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
