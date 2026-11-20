<?php

declare(strict_types=1);

namespace App\Scripts\Support;

use App\Scripts\Enums\DiagnosticCode;
use App\Scripts\Enums\KeywordCategory;
use App\Scripts\Enums\SyntaxForm;
use App\Scripts\Exceptions\ScriptSyntaxError;
use App\Scripts\Values\BlockOperand;
use App\Scripts\Values\BooleanOperand;
use App\Scripts\Values\CommandOperand;
use App\Scripts\Values\KeywordDefinition;
use App\Scripts\Values\ParsedStatement;
use App\Scripts\Values\ScriptHandler;
use App\Scripts\Values\ScriptLine;
use App\Scripts\Values\TextOperand;

final readonly class ScriptParser
{
    private const int NESTING_LIMIT = 4;

    private const int TEXT_LIMIT = 4096;

    public function __construct(private KeywordRegistry $keywords) {}

    /**
     * @param list<ScriptLine> $lines
     * @return list<ScriptHandler>
     */
    public function parse(array $lines): array
    {
        $cursor = new ScriptCursor($lines);
        $handlers = [];

        while (($line = $cursor->current()) !== null) {
            $handler = $this->handler($cursor, $line);

            if (isset($handlers[$handler->trigger->token])) {
                throw ScriptSyntaxError::at(DiagnosticCode::DuplicateHandler, $line->source, 'Duplicate handler.');
            }

            $handlers[$handler->trigger->token] = $handler;
        }

        return array_values($handlers);
    }

    private function handler(ScriptCursor $cursor, ScriptLine $line): ScriptHandler
    {
        $opening = $this->keyword($line);
        if ($opening->form === SyntaxForm::EndBlock || $opening->form === SyntaxForm::ElseBlock) {
            throw ScriptSyntaxError::at(DiagnosticCode::UnexpectedEnd, $line->source, 'Unexpected block ending.');
        }

        if ($opening->form !== SyntaxForm::Handler) {
            throw ScriptSyntaxError::at(
                DiagnosticCode::InvalidForm,
                $line->source,
                'A handler begins with ON and a trigger.',
                'ON STOP',
            );
        }

        $trigger = $this->keywords->find($line->operand);
        if ($trigger->isEmpty() || ! $trigger->get()->definition instanceof KeywordDefinition
            || $trigger->get()->definition->category !== KeywordCategory::Trigger) {
            throw ScriptSyntaxError::at(DiagnosticCode::UnknownTrigger, $line->operandSource, 'Unknown trigger.');
        }

        if (! $this->keywords->isAvailable($trigger->get())) {
            throw ScriptSyntaxError::at(
                DiagnosticCode::UnavailableDefinition,
                $line->operandSource,
                'The trigger is unavailable.',
            );
        }

        $cursor->advance();
        $statements = $this->body($cursor, 0);
        $this->end($cursor, $line);

        return new ScriptHandler($trigger->get()->definition, $line->source, $statements);
    }

    /** @return list<ParsedStatement> */
    private function body(ScriptCursor $cursor, int $depth): array
    {
        $statements = [];

        while (($line = $cursor->current()) !== null) {
            $keyword = $this->keyword($line);

            if ($keyword->form === SyntaxForm::ElseBlock || $keyword->form === SyntaxForm::EndBlock) {
                return $statements;
            }

            if ($keyword->category !== KeywordCategory::Statement) {
                throw ScriptSyntaxError::at(DiagnosticCode::InvalidForm, $line->source, 'Expected a statement.');
            }

            $cursor->countStatement($line->source);
            $cursor->advance();
            $operand = match ($keyword->form) {
                SyntaxForm::Block => $this->block($cursor, $line, $depth + 1),
                SyntaxForm::Expression => $this->expression($line),
                SyntaxForm::CommandKey => $this->command($line),
                SyntaxForm::Text => $this->text($line),
                default => throw self::formError($line, $keyword->form->value),
            };
            $statements[] = new ParsedStatement($keyword, $line->source, $line->operandSource, $operand);
        }

        return $statements;
    }

    private function block(ScriptCursor $cursor, ScriptLine $line, int $depth): BlockOperand
    {
        if ($depth > self::NESTING_LIMIT) {
            throw ScriptSyntaxError::at(DiagnosticCode::NestingLimit, $line->source, 'At most four nested blocks.');
        }

        $condition = $this->expression($line);
        $whenTrue = $this->body($cursor, $depth);
        $elseLine = $cursor->current();
        $whenFalse = [];

        if ($elseLine !== null && $this->keyword($elseLine)->form === SyntaxForm::ElseBlock) {
            self::assertNoOperand($elseLine);
            $cursor->advance();
            $whenFalse = $this->body($cursor, $depth);
        }

        $this->end($cursor, $line);

        return new BlockOperand($condition, $whenTrue, $whenFalse);
    }

    private function end(ScriptCursor $cursor, ScriptLine $opening): void
    {
        $line = $cursor->current();
        if ($line === null) {
            throw ScriptSyntaxError::at(DiagnosticCode::UnclosedBlock, $opening->source, 'Expected END.', 'END');
        }

        if ($this->keyword($line)->form !== SyntaxForm::EndBlock) {
            throw ScriptSyntaxError::at(DiagnosticCode::UnexpectedEnd, $line->source, 'Expected END.', 'END');
        }

        self::assertNoOperand($line);
        $cursor->advance();
    }

    private function keyword(ScriptLine $line): KeywordDefinition
    {
        $entry = $this->keywords->find($line->token);
        if ($entry->isEmpty()) {
            throw ScriptSyntaxError::at(DiagnosticCode::UnknownKeyword, $line->source, 'Unknown script keyword.');
        }

        $word = $entry->get();
        if (! $word->definition instanceof KeywordDefinition || ! $this->keywords->isAvailable($word)) {
            throw ScriptSyntaxError::at(DiagnosticCode::UnavailableDefinition, $line->source, 'Keyword unavailable.');
        }

        return $word->definition;
    }

    private function expression(ScriptLine $line): BooleanOperand
    {
        if (preg_match('/^(?:(NOT)\h+)?([a-z][a-z0-9_]*)\.([a-zA-Z_]\w*)$/D', $line->operand, $parts) !== 1) {
            throw self::formError($line, 'object.member or NOT object.member');
        }

        return new BooleanOperand($parts[2], $parts[3], $parts[1] !== '');
    }

    private function command(ScriptLine $line): CommandOperand
    {
        if (preg_match('/^[a-z][a-z0-9.-]*$/D', $line->operand) !== 1) {
            throw self::formError($line, 'command key');
        }

        return new CommandOperand($line->operand);
    }

    private function text(ScriptLine $line): TextOperand
    {
        $literal = '~^"(?:[^"\\\\]|\\\\["\\\\])*"$~uD';

        if (strlen($line->operand) > self::TEXT_LIMIT || preg_match($literal, $line->operand) !== 1) {
            throw self::formError($line, 'quoted text');
        }

        return new TextOperand(strtr(substr($line->operand, 1, -1), ['\\"' => '"', '\\\\' => '\\']));
    }

    private static function assertNoOperand(ScriptLine $line): void
    {
        if ($line->operand !== '') {
            throw self::formError($line, $line->token);
        }
    }

    private static function formError(ScriptLine $line, string $expected): ScriptSyntaxError
    {
        return ScriptSyntaxError::at(
            DiagnosticCode::InvalidForm,
            $line->operandSource,
            'Invalid operand.',
            $expected,
        );
    }
}
