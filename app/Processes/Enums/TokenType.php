<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * What one token of a shell line is: a word, an operator, a redirect, a comment or a here-document body.
 */
enum TokenType: string
{
    case Word = 'word';
    case Newline = 'newline';
    case Semicolon = 'semicolon';
    case Background = 'background';
    case AndIf = 'and_if';
    case OrIf = 'or_if';
    case Pipe = 'pipe';
    case PipeBoth = 'pipe_both';
    case Bang = 'bang';
    case OpenParen = 'open_paren';
    case CloseParen = 'close_paren';
    case OpenBrace = 'open_brace';
    case CloseBrace = 'close_brace';
    case Redirect = 'redirect';
    case Comment = 'comment';
    case HereDocumentBody = 'here_document_body';

    /**
     * Whether the token opens a subshell or a group.
     */
    public function isGroupOpener(): bool
    {
        return $this === self::OpenParen || $this === self::OpenBrace;
    }

    /**
     * Whether the token closes a subshell or a group.
     */
    public function isGroupCloser(): bool
    {
        return $this === self::CloseParen || $this === self::CloseBrace;
    }

    /**
     * Whether the token ends one command of a list or pipeline, so the next word starts another.
     */
    public function isCommandSeparator(): bool
    {
        return in_array(
            $this,
            [self::Newline, self::Semicolon, self::AndIf, self::OrIf, self::Pipe, self::PipeBoth, self::Background],
            true,
        );
    }

    /**
     * Whether a word right after this token stands where a command starts, so a reserved word there is read as one.
     */
    public function isFollowedByCommand(): bool
    {
        return $this->isCommandSeparator() || $this->isGroupOpener() || $this->isGroupCloser() || $this === self::Bang;
    }
}
