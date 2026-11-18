<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Pipelines\Support\Pipelines;
use App\Processes\Enums\AnalysisLimit;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\RedirectType;
use App\Processes\Enums\TokenType;
use App\Processes\Enums\WordSegmentType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\AnalyseLinePipeline;
use App\Processes\Stages\ReadSource;
use App\Processes\Stages\ScannedSource;
use App\Processes\Stages\ShellSource;
use App\Processes\Values\Redirect;
use App\Processes\Values\SourceRange;
use App\Processes\Values\Word;
use App\Processes\Values\WordSegment;

/**
 * Recursive descent over one scanned source's tokens into the analysis's tree draft (doc 21 revision 3, section 5).
 * Lists, and/or chains, pipelines, negation, background jobs, subshells, groups, assignments and redirects are
 * supported; the inside of each command or process substitution runs through the same line pipeline one level deeper,
 * into children of the command that holds it. Loops, conditionals, functions, coprocesses, arrays, arithmetic and
 * shell-option statements become Unsupported nodes. Invalid syntax or a limit stops the reading with ShellGrammarStopped.
 */
final class ShellGrammar
{
    private const array UNSUPPORTED_KEYWORDS = [
        'if' => 'fi', 'while' => 'done', 'until' => 'done', 'for' => 'done', 'select' => 'done', 'case' => 'esac',
        'coproc' => null,
    ];

    private const array OPTION_STATEMENTS = ['set', 'shopt', 'setopt', 'unsetopt'];

    /**
     * Words that only continue a construct; at the start of a command they make the line invalid, as in bash.
     */
    private const array RESERVED_OUT_OF_PLACE = ['then', 'elif', 'else', 'fi', 'do', 'done', 'esac', 'in'];

    private readonly TreeDraft $draft;

    private readonly ShellSource $source;

    public function __construct(
        private readonly Pipelines $pipelines,
        private readonly ShellLexer $lexer,
        private readonly ScannedSource $scanned,
    ) {
        $this->source = $scanned->source;
        $this->draft = $this->source->draft;
    }

    /**
     * Reads the scanned source as a Sequence node under its parent.
     *
     * @throws ShellGrammarStopped
     */
    public function read(): ReadSource
    {
        $source = $this->source;
        $cursor = new TokenCursor($this->scanned->tokens, $source->offset);
        $sequence = $this->draft->add(NodeType::Sequence, new SourceRange($source->offset, $source->offset + strlen($source->text)), $source->parent);
        $this->parseList($cursor, $sequence, $source->depth, closing: null);
        if (! $cursor->atEnd()) {
            throw ShellGrammarStopped::invalid('Unexpected '.$cursor->currentType()->value.'.', $cursor->position());
        }

        return new ReadSource($source, $sequence);
    }

    /**
     * list := and_or ((; | & | newline) and_or)*, up to the closing token of a subshell or group, or the end.
     *
     * @throws ShellGrammarStopped
     */
    private function parseList(TokenCursor $cursor, int $parent, int $depth, TokenType|null $closing): void
    {
        $separated = true;
        while (true) {
            if ($cursor->is(TokenType::Semicolon) && $cursor->peekIs(1, TokenType::Semicolon)) {
                throw ShellGrammarStopped::invalid('A case terminator ;; stands outside a case.', $cursor->position());
            }
            if ($cursor->is(TokenType::Semicolon)) {
                if ($separated) {
                    throw ShellGrammarStopped::invalid('A ; stands where a command should be.', $cursor->position());
                }
                $cursor->advance();
            }
            $separated = true;
            $cursor->skip(TokenType::Newline, TokenType::Comment);
            if ($cursor->atEnd() || ($closing !== null && $cursor->is($closing))) {
                return;
            }
            if ($cursor->is(TokenType::CloseParen) || $cursor->is(TokenType::CloseBrace)) {
                return;
            }

            $item = $this->parseAndOr($cursor, $depth);
            if ($cursor->is(TokenType::Background)) {
                $background = $this->draft->add(NodeType::Background, $this->draft->rangeTo($item, $cursor->currentEnd()), $parent);
                $this->draft->adopt($background, $item);
                $cursor->advance();

                continue;
            }
            $this->draft->adopt($parent, $item);
            $endsHere = $cursor->atEnd() || $cursor->is(TokenType::Newline) || $cursor->is(TokenType::Semicolon) || $cursor->is(TokenType::Comment)
                || $cursor->is(TokenType::CloseParen) || $cursor->is(TokenType::CloseBrace);
            if (! $endsHere) {
                throw ShellGrammarStopped::invalid('Unexpected '.$cursor->currentType()->value.' after a command.', $cursor->position());
            }
            $separated = false;
        }
    }

    /**
     * and_or := pipeline ((&& | ||) pipeline)*, joined from the left.
     *
     * @throws ShellGrammarStopped
     */
    private function parseAndOr(TokenCursor $cursor, int $depth): int
    {
        $left = $this->parsePipeline($cursor, $depth);
        while ($cursor->is(TokenType::AndIf) || $cursor->is(TokenType::OrIf)) {
            $type = $cursor->is(TokenType::AndIf) ? NodeType::AndList : NodeType::OrList;
            $cursor->advance();
            $cursor->skip(TokenType::Newline, TokenType::Comment);
            $right = $this->parsePipeline($cursor, $depth);
            $joined = $this->draft->add($type, new SourceRange($this->draft->range($left)->start, $this->draft->range($right)->end), null);
            $this->draft->adopt($joined, $left);
            $this->draft->adopt($joined, $right);
            $left = $joined;
        }

        return $left;
    }

    /**
     * pipeline := [!] command ((| | |&) command)*.
     *
     * @throws ShellGrammarStopped
     */
    private function parsePipeline(TokenCursor $cursor, int $depth): int
    {
        $negationStart = $cursor->is(TokenType::Bang) ? $cursor->position() : null;
        if ($negationStart !== null) {
            $cursor->advance();
        }

        $commands = [$this->parseCommand($cursor, $depth)];
        while ($cursor->is(TokenType::Pipe) || $cursor->is(TokenType::PipeBoth)) {
            $cursor->advance();
            $cursor->skip(TokenType::Newline, TokenType::Comment);
            $commands[] = $this->parseCommand($cursor, $depth);
        }

        $result = $commands[0];
        if (count($commands) > 1) {
            $result = $this->draft->add(NodeType::Pipeline, new SourceRange($this->draft->range($commands[0])->start, $this->draft->range($commands[array_key_last($commands)])->end), null);
            foreach ($commands as $command) {
                $this->draft->adopt($result, $command);
            }
        }
        if ($negationStart !== null) {
            $negation = $this->draft->add(NodeType::Negation, new SourceRange($negationStart, $this->draft->range($result)->end), null);
            $this->draft->adopt($negation, $result);
            $result = $negation;
        }

        return $result;
    }

    /**
     * command := ( list ) redirects | { list } redirects | an unsupported construct | simple command.
     *
     * @throws ShellGrammarStopped
     */
    private function parseCommand(TokenCursor $cursor, int $depth): int
    {
        $this->draft->checkBudget($cursor->position());
        if ($cursor->atEnd()) {
            throw ShellGrammarStopped::invalid('A command is missing at the end of the line.', $cursor->position());
        }

        if ($cursor->is(TokenType::OpenParen)) {
            return $this->parseCompound($cursor, $depth, NodeType::Subshell, TokenType::CloseParen);
        }
        if ($cursor->is(TokenType::OpenBrace)) {
            return $this->parseCompound($cursor, $depth, NodeType::Group, TokenType::CloseBrace);
        }

        $first = $cursor->currentLiteral();
        if (in_array($first, self::RESERVED_OUT_OF_PLACE, true)) {
            throw ShellGrammarStopped::invalid("The reserved word '{$first}' stands where a command should.", $cursor->position());
        }
        if ($first === 'function' && $cursor->peekIs(1, TokenType::Word)) {
            if ($cursor->peekIs(2, TokenType::OpenParen) && ! $cursor->peekIs(3, TokenType::CloseParen)) {
                throw ShellGrammarStopped::invalid('A function name is followed by arguments.', $cursor->position());
            }

            return $this->parseFunctionDefinition($cursor, $depth, $cursor->peekIs(2, TokenType::OpenParen) ? 4 : 2);
        }
        if ($first === 'time' && ($cursor->peekIs(1, TokenType::OpenParen) || $cursor->peekIs(1, TokenType::OpenBrace))) {
            $cursor->advance();

            return $this->parseCommand($cursor, $depth);
        }
        if ($first !== null && str_starts_with($first, '((')) {
            return $this->skipUnsupported($cursor, 'An arithmetic command (( )) is not supported.', null);
        }
        if (in_array($first, self::OPTION_STATEMENTS, true)) {
            $statement = $this->parseSimpleCommand($cursor, $depth);
            $this->draft->markStatementUnsupported($statement, "The shell option statement '{$first}' is not supported.");

            return $statement;
        }
        if ($first !== null && array_key_exists($first, self::UNSUPPORTED_KEYWORDS)) {
            return $this->skipUnsupported($cursor, "The shell construct '{$first}' is not supported.", self::UNSUPPORTED_KEYWORDS[$first]);
        }
        if ($this->startsArrayAssignment($cursor)) {
            return $this->skipUnsupported($cursor, 'An array assignment is not supported.', null);
        }
        if ($cursor->is(TokenType::Word) && $cursor->peekIs(1, TokenType::OpenParen) && $cursor->peekIs(2, TokenType::CloseParen)) {
            return $this->parseFunctionDefinition($cursor, $depth, 3);
        }

        return $this->parseSimpleCommand($cursor, $depth);
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function parseCompound(TokenCursor $cursor, int $depth, NodeType $type, TokenType $closing): int
    {
        if (AnalysisLimit::Depth->isPassedBy($depth + 1)) {
            throw ShellGrammarStopped::pastLimit(AnalysisLimit::Depth, $cursor->position());
        }
        $open = $cursor->current();
        $cursor->advance();
        $compound = $this->draft->add($type, new SourceRange($open->range->start, $open->range->end), null);
        $this->parseList($cursor, $compound, $depth + 1, $closing);
        if (! $cursor->is($closing)) {
            throw ShellGrammarStopped::invalid('The '.($type === NodeType::Subshell ? 'subshell' : 'group').' opened here is not closed.', $open->range->start + $cursor->offset());
        }
        $end = $cursor->currentEnd();
        $cursor->advance();
        $redirects = [];
        while ($cursor->is(TokenType::Redirect)) {
            $redirects[] = $this->parseRedirect($cursor, $compound, $depth);
            $end = $redirects[array_key_last($redirects)]->range->end;
        }
        $this->draft->finish($compound, new SourceRange($open->range->start + $cursor->offset(), $end), [], $redirects);

        return $compound;
    }

    /**
     * simple := (assignment | word | redirect)+; a line of only redirects is still a command, with no program.
     *
     * @throws ShellGrammarStopped
     */
    private function parseSimpleCommand(TokenCursor $cursor, int $depth): int
    {
        $start = $cursor->position();
        $command = $this->draft->add(NodeType::SimpleCommand, new SourceRange($start, $start), null);
        $this->draft->countExecutablePart($start);

        $words = [];
        $redirects = [];
        $end = $start;
        while (! $cursor->atEnd()) {
            $token = $cursor->current();
            if ($token->type === TokenType::Redirect) {
                $redirects[] = $this->parseRedirect($cursor, $command, $depth);
                $end = $redirects[array_key_last($redirects)]->range->end;

                continue;
            }
            if (! in_array($token->type, [TokenType::Word, TokenType::OpenBrace, TokenType::CloseBrace], true) || ($token->type === TokenType::CloseBrace && $words === [])) {
                break;
            }
            $word = $cursor->word('A word is missing.');
            if ($cursor->peekIs(1, TokenType::OpenParen) && $this->endsWithEquals($word)) {
                $this->draft->uncountExecutablePart();
                $this->draft->remove($command);

                return $this->skipUnsupported($cursor, 'An array assignment is not supported.', null);
            }
            if ($words === [] && $this->isAssignment($word)) {
                $assignment = $this->draft->add(NodeType::Assignment, $word->range, $command);
                $this->draft->setWords($assignment, [$word]);
            } else {
                $words[] = $word;
            }
            $this->addSubstitutions($word, $command, $depth);
            $end = $word->range->end;
            $cursor->advance();
        }

        if ($words === [] && $redirects === [] && ! $this->draft->hasChildren($command)) {
            throw ShellGrammarStopped::invalid('A command is missing here.', $start);
        }
        $this->draft->finish($command, new SourceRange($start, $end), $words, $redirects);

        return $command;
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function parseRedirect(TokenCursor $cursor, int $owner, int $depth): Redirect
    {
        $operator = $cursor->current();
        $type = $operator->redirect ?? RedirectType::Output;
        $cursor->advance();
        $start = $operator->range->start + $cursor->offset();

        if ($type === RedirectType::Close) {
            return new Redirect($operator->descriptor, $type, new Word([], $operator->range->shiftedBy($cursor->offset())), $operator->range->shiftedBy($cursor->offset()));
        }
        if (! $cursor->is(TokenType::Word)) {
            throw ShellGrammarStopped::invalid('A redirect has no target.', $start);
        }
        $target = $cursor->word('A redirect has no target.');
        $cursor->advance();

        if ($type === RedirectType::HereDocument) {
            $body = $cursor->takeHereDocumentBody() ?? throw ShellGrammarStopped::invalid('A here-document has no body.', $start);
            $hereDocument = $this->draft->add(NodeType::HereDocument, $body->range->shiftedBy($cursor->offset()), $owner);
            if ($body->word !== null) {
                $this->addSubstitutions($body->word->shiftedBy($cursor->offset()), $hereDocument, $depth);
            }
            $document = $body->hereDocument ?? throw ShellGrammarStopped::invalid('A here-document has no body.', $start);

            return new Redirect($operator->descriptor, $type, $document, new SourceRange($start, $target->range->end));
        }
        $this->addSubstitutions($target, $owner, $depth);

        return new Redirect($operator->descriptor, $type, $target, new SourceRange($start, $target->range->end));
    }

    /**
     * Reads every command and process substitution of a word as its own line, into children of the owner node.
     *
     * @throws ShellGrammarStopped
     */
    private function addSubstitutions(Word $word, int $owner, int $depth): void
    {
        foreach ($word->segments as $segment) {
            if ($segment->type === WordSegmentType::Literal && str_starts_with($segment->text, '[[ ') && str_ends_with($segment->text, ']]')) {
                $this->addInnerSubstitutions(substr($segment->text, 3, -2), $segment->range->start + 3, $owner, $depth);

                continue;
            }
            if ($segment->type !== WordSegmentType::Expansion) {
                continue;
            }
            $opening = substr($this->draft->line, $segment->range->start, 2);
            if ($opening === '${') {
                $this->addInnerSubstitutions(substr($segment->text, 2, -1), $segment->range->start + 2, $owner, $depth);

                continue;
            }
            if (substr($this->draft->line, $segment->range->start, 3) === '$((') {
                $this->addArithmeticSubstitutions($segment, $owner, $depth);

                continue;
            }
            $type = match (true) {
                $opening === '$(' => NodeType::CommandSubstitution,
                $opening[0] === '`' => NodeType::CommandSubstitution,
                $opening === '<(' || $opening === '>(' => NodeType::ProcessSubstitution,
                default => null,
            };
            if ($type === null) {
                continue;
            }
            if ($opening[0] === '`' && str_contains($segment->text, '\\`')) {
                $this->draft->markUnsupported('A backtick substitution nested inside another is not supported.', $segment->range->start);
            }
            $substitution = $this->draft->add($type, $segment->range, $owner);
            $innerOffset = $segment->range->start + ($opening[0] === '`' ? 1 : 2);
            $this->pipelines->run(AnalyseLinePipeline::class, $this->source->inner($segment->text, $innerOffset, $depth + 1, $substitution), ReadSource::class);
        }
    }

    /**
     * An arithmetic expansion runs no command itself, but the command substitutions inside it do: they are read as
     * children of the owner like any other. Its comparison and shift signs are blanked first, since they are no redirects.
     *
     * @throws ShellGrammarStopped
     */
    private function addArithmeticSubstitutions(WordSegment $segment, int $owner, int $depth): void
    {
        $this->addInnerSubstitutions(strtr($segment->text, '<>', '  '), $segment->range->start + 2, $owner, $depth);
    }

    /**
     * Reads the command substitutions inside text that is not itself shell syntax, an arithmetic expansion or a
     * [[ ]] test, as children of the owner.
     *
     * @throws ShellGrammarStopped
     */
    private function addInnerSubstitutions(string $text, int $offset, int $owner, int $depth): void
    {
        $lexed = $this->lexer->lex($text, $this->draft->dialect);
        if ($lexed->outcome !== ParseOutcome::Complete) {
            throw ShellGrammarStopped::fromLexedLine($lexed, $offset);
        }
        foreach ($lexed->tokens as $token) {
            if ($token->word !== null) {
                $this->addSubstitutions($token->word->shiftedBy($offset), $owner, $depth + 1);
            }
        }
    }

    /**
     * A function definition is not supported, but its body must still be a complete group or subshell: the body is read
     * to check it, and the definition becomes one Unsupported node.
     *
     * @throws ShellGrammarStopped
     */
    private function parseFunctionDefinition(TokenCursor $cursor, int $depth, int $headerTokens): int
    {
        $start = $cursor->position();
        for ($skipped = 0; $skipped < $headerTokens; $skipped++) {
            $cursor->advance();
        }
        $cursor->skip(TokenType::Newline);
        if (! $cursor->is(TokenType::OpenBrace) && ! $cursor->is(TokenType::OpenParen)) {
            throw ShellGrammarStopped::invalid('A function definition has no body.', $start);
        }
        $isGroup = $cursor->is(TokenType::OpenBrace);
        $body = $this->parseCompound($cursor, $depth, $isGroup ? NodeType::Group : NodeType::Subshell, $isGroup ? TokenType::CloseBrace : TokenType::CloseParen);
        $definition = $this->draft->add(NodeType::Unsupported, new SourceRange($start, $this->draft->range($body)->end), null);
        $this->draft->adopt($definition, $body);
        $this->draft->markUnsupported('A function definition is not supported.', $start);

        return $definition;
    }

    /**
     * Records a construct the grammar does not support as one Unsupported node, reading past its body; the first such
     * construct names the tree's outcome.
     */
    private function skipUnsupported(TokenCursor $cursor, string $reason, string|null $terminator): int
    {
        $start = $cursor->position();
        $end = $cursor->currentEnd();
        $opener = $cursor->currentLiteral();
        $construct = new UnsupportedConstruct($terminator, array_keys(self::UNSUPPORTED_KEYWORDS, $terminator, true));
        $cursor->advance();
        while (! $cursor->atEnd() && ! $construct->endsBefore($cursor->current())) {
            $end = $cursor->currentEnd();
            $construct->read($cursor->current(), $cursor->currentLiteral());
            $cursor->advance();
            if ($construct->isClosed()) {
                $end = $this->endOfTrailingRedirects($cursor, $end);

                break;
            }
        }
        if ($construct->needsClosing()) {
            throw ShellGrammarStopped::invalid("The '{$opener}' opened here is not closed by '{$terminator}'.", $start);
        }
        $this->draft->markUnsupported($reason, $start);

        return $this->draft->add(NodeType::Unsupported, new SourceRange($start, $end), null);
    }

    /**
     * Reads past the redirects that follow a closed unsupported construct, and returns where the last one ends.
     */
    private function endOfTrailingRedirects(TokenCursor $cursor, int $end): int
    {
        while ($cursor->is(TokenType::Redirect)) {
            $cursor->advance();
            if ($cursor->is(TokenType::Word)) {
                $end = $cursor->currentEnd();
                $cursor->advance();
            }
        }

        return $end;
    }

    private function isAssignment(Word $word): bool
    {
        $first = $word->segments[0] ?? null;

        return $first !== null && $first->type === WordSegmentType::Literal && preg_match('/^[A-Za-z_][A-Za-z0-9_]*\+?=/', $first->text) === 1;
    }

    /**
     * Whether the current word ends in = and an opening parenthesis follows, as in name=(a b).
     */
    private function startsArrayAssignment(TokenCursor $cursor): bool
    {
        if (! $cursor->is(TokenType::Word) || ! $cursor->peekIs(1, TokenType::OpenParen)) {
            return false;
        }

        return $this->endsWithEquals($cursor->word('A word is missing.'));
    }

    private function endsWithEquals(Word $word): bool
    {
        return count($word->segments) === 1 && str_ends_with($word->segments[0]->text, '=');
    }
}
