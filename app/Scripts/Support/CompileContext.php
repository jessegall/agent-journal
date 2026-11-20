<?php

declare(strict_types=1);

namespace App\Scripts\Support;

use App\Profiles\Values\NamedCommand;
use App\Scripts\Contracts\ScriptStatement;
use App\Scripts\Enums\DiagnosticCode;
use App\Scripts\Exceptions\ScriptSyntaxInvalid;
use App\Scripts\Values\BlockOperand;
use App\Scripts\Values\BooleanOperand;
use App\Scripts\Values\Instruction;
use App\Scripts\Values\ParsedStatement;
use App\Scripts\Values\TextOperand;
use App\Scripts\Values\TriggerPolicy;

final readonly class CompileContext
{
    /** @param array<string, NamedCommand> $commands */
    public function __construct(
        private KeywordRegistry $keywords,
        private ObjectRegistry $objects,
        private ScriptGraph $graph,
        private array $commands,
        public TriggerPolicy $policy,
        public string $next,
    ) {}

    /** @param list<ParsedStatement> $statements */
    public function compileBlock(array $statements): string
    {
        $next = $this->next;

        foreach (array_reverse($statements) as $statement) {
            $context = clone ($this, ['next' => $next]);
            $implementation = $this->keywords->statement($statement->keyword);
            $this->recordKeyword($statement, $implementation);
            $next = $this->graph->add($implementation->compile($statement, $context), $implementation->flow()->ports);
        }

        return $next;
    }

    public function command(ParsedStatement $statement): Instruction
    {
        $key = $statement->commandKey();

        if (! isset($this->commands[$key])) {
            throw ScriptSyntaxInvalid::at(
                DiagnosticCode::UnknownCommand,
                $statement->operandSource,
                "Unknown command {$key}.",
            );
        }

        $command = $this->commands[$key];
        $this->graph->remember('command:'.$key, $command);

        return new Instruction($statement->keyword->token, $statement->source, $command, [
            'passed' => $this->next,
            'failure' => $this->policy->failure,
        ]);
    }

    public function check(ParsedStatement $statement): Instruction
    {
        $condition = $statement->operand;

        if (! $condition instanceof BooleanOperand) {
            throw self::invalidOperand($statement);
        }

        $this->assertReadable($statement, $condition);

        return new Instruction($statement->keyword->token, $statement->source, $condition, [
            'passed' => $this->next,
            'failure' => $this->policy->failure,
        ]);
    }

    public function branch(ParsedStatement $statement): Instruction
    {
        $block = $statement->operand;

        if (! $block instanceof BlockOperand) {
            throw self::invalidOperand($statement);
        }

        $this->assertReadable($statement, $block->condition);

        return new Instruction($statement->keyword->token, $statement->source, $block->condition, [
            'true' => $this->compileBlock($block->whenTrue),
            'false' => $this->compileBlock($block->whenFalse),
            'failure' => $this->policy->failure,
        ]);
    }

    public function yieldToActor(ParsedStatement $statement): Instruction
    {
        return $this->textInstruction($statement, ['returned' => $this->policy->returnToActor]);
    }

    public function textAction(ParsedStatement $statement): Instruction
    {
        return $this->textInstruction($statement, ['passed' => $this->next, 'failure' => $this->policy->failure]);
    }

    /** @param array<string, string> $successors */
    private function textInstruction(ParsedStatement $statement, array $successors): Instruction
    {
        $operand = $statement->operand;

        if (! $operand instanceof TextOperand) {
            throw self::invalidOperand($statement);
        }

        return new Instruction($statement->keyword->token, $statement->source, $operand, $successors);
    }

    private function assertReadable(ParsedStatement $statement, BooleanOperand $condition): void
    {
        $found = $this->objects->find($condition->object);
        $range = $statement->operandSource;

        if ($found->isEmpty()) {
            throw ScriptSyntaxInvalid::at(DiagnosticCode::UnknownObject, $range, 'Unknown script object.');
        }

        $object = $found->get();
        if (! isset($object->members[$condition->member])) {
            throw ScriptSyntaxInvalid::at(DiagnosticCode::UnknownMember, $range, 'Unknown boolean member.');
        }

        if (! $this->objects->isAvailable($object)) {
            throw ScriptSyntaxInvalid::at(DiagnosticCode::UnavailableDefinition, $range, 'Script object unavailable.');
        }

        $member = $object->members[$condition->member];
        $this->graph->remember("object:{$object->key}.{$member->name}", [$object->owner, $object->class, $member]);
    }

    private function recordKeyword(ParsedStatement $statement, ScriptStatement $implementation): void
    {
        $keyword = $statement->keyword;
        $registered = $this->keywords->get($keyword->token);
        $this->graph->remember('keyword:'.$keyword->token, [
            $registered->owner, $keyword->form, $keyword->implementation, $keyword->effects, $implementation->flow(),
        ]);
    }

    private static function invalidOperand(ParsedStatement $statement): ScriptSyntaxInvalid
    {
        return ScriptSyntaxInvalid::at(DiagnosticCode::InvalidForm, $statement->operandSource, 'Invalid operand.');
    }
}
