<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\RedirectType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellLineUnreadable;
use App\Processes\Values\SourceRange;

/**
 * Reads shell operators, redirects and arithmetic commands.
 */
final readonly class ShellOperatorScanner
{
    /**
     * Reads an operator or a redirect at the position; answers false when a word starts here instead.
     */
    public function read(LexerCursor $cursor): bool
    {
        $start = $cursor->position;
        $extended = $cursor->dialect !== ShellDialect::Sh;
        $digits = strspn($cursor->source, '0123456789', $start);
        $afterDigits = $cursor->at($start + $digits);

        if (($afterDigits === '<' || $afterDigits === '>')
            && ! ($extended && $cursor->at($start + $digits + 1) === '(' && $digits === 0)) {
            return $this->readRedirect($cursor, $start, $digits);
        }
        if ($digits > 0) {
            return false;
        }

        if ($cursor->source[$start] === '(' && $cursor->at($start + 1) === '(' && $cursor->atCommandStart()) {
            $this->readArithmeticCommand($cursor, $start);

            return true;
        }

        foreach ($this->operators($extended) as $text => $type) {
            if (substr_compare($cursor->source, $text, $start, strlen($text)) !== 0) {
                continue;
            }
            if ($type === TokenType::Bang && ! $this->isNegation($cursor)) {
                return false;
            }
            $cursor->position += strlen($text);
            if ($type === TokenType::Redirect) {
                $redirect = $text === '&>>' ? RedirectType::Append : RedirectType::Output;
                $this->emitRedirect($cursor, $redirect, 1, $start);

                return true;
            }
            $cursor->emit($type, $start, $cursor->position);

            return true;
        }

        return false;
    }

    private function isNegation(LexerCursor $cursor): bool
    {
        return $cursor->atCommandStart() && in_array($cursor->at($cursor->position + 1), [' ', "\t", "\n", ''], true);
    }

    /**
     * @return array<string, TokenType>
     */
    private function operators(bool $extended): array
    {
        $operators = ['&&' => TokenType::AndIf, '||' => TokenType::OrIf];
        if ($extended) {
            $operators += ['|&' => TokenType::PipeBoth, '&>>' => TokenType::Redirect, '&>' => TokenType::Redirect];
        }

        return $operators + [
            ';' => TokenType::Semicolon,
            '&' => TokenType::Background,
            '|' => TokenType::Pipe,
            '!' => TokenType::Bang,
            '(' => TokenType::OpenParen,
            ')' => TokenType::CloseParen,
        ];
    }

    private function readRedirect(LexerCursor $cursor, int $start, int $digits): bool
    {
        $cursor->position = $start + $digits;
        $descriptor = $digits > 0 ? (int) substr($cursor->source, $start, $digits) : null;
        $extended = $cursor->dialect !== ShellDialect::Sh;

        $forms = [
            '<<<' => $extended ? RedirectType::HereString : null,
            '<<-' => RedirectType::HereDocument,
            '<<' => RedirectType::HereDocument,
            '<>' => RedirectType::ReadWrite,
            '<&' => RedirectType::DuplicateInput,
            '<' => RedirectType::Input,
            '>>' => RedirectType::Append,
            '>|' => RedirectType::Clobber,
            '>&' => RedirectType::DuplicateOutput,
            '>' => RedirectType::Output,
        ];
        foreach ($forms as $text => $type) {
            if ($type === null || substr_compare($cursor->source, $text, $cursor->position, strlen($text)) !== 0) {
                continue;
            }
            $cursor->position += strlen($text);
            if ($type->isDuplicate() && $cursor->at($cursor->position) === '-') {
                $cursor->position++;
                $type = RedirectType::Close;
            }
            $this->emitRedirect($cursor, $type, $descriptor ?? ($text[0] === '<' ? 0 : 1), $start);
            if ($type === RedirectType::HereDocument) {
                $cursor->hereDocuments->expectDelimiter($text === '<<-');
            }

            return true;
        }

        return false;
    }

    /**
     * Reads (( ... )) up to its closing parentheses as one literal word, so nothing inside, such as <<, is lexed as
     * shell syntax; the grammar names it an unsupported arithmetic command.
     *
     * @throws ShellLineUnreadable
     */
    private function readArithmeticCommand(LexerCursor $cursor, int $start): void
    {
        $depth = 0;
        $length = strlen($cursor->source);
        for ($index = $start; $index < $length; $index++) {
            $cursor->assertWithinBudget();
            $character = $cursor->source[$index];
            if ($character === '(') {
                $depth++;
            } elseif ($character === ')' && --$depth === 0) {
                $cursor->emitLiteralWord($start, $index + 1);

                return;
            }
        }

        throw ShellLineUnreadable::unfinished('an arithmetic command', $start);
    }

    private function emitRedirect(LexerCursor $cursor, RedirectType $type, int $descriptor, int $start): void
    {
        $cursor->append(new Token(
            TokenType::Redirect,
            new SourceRange($start, $cursor->position),
            redirect: $type,
            descriptor: $descriptor,
        ));
    }
}
