<?php

declare(strict_types=1);

namespace Tests\Fixtures\Scripts;

use App\Contracts\Scripts\ScriptStatement;
use App\Enums\Profiles\ScriptEffect;
use App\Enums\CommandRules\SyntaxForm;
use App\Support\CompileContext;
use App\Values\FlowShape;
use App\Values\Instruction;
use App\Values\KeywordDefinition;
use App\Values\ParsedStatement;
use App\Values\RunContext;
use App\Values\StepOutcome;

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
