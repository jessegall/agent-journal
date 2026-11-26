<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\ParseOutcome;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\Lines\ScannedSource;
use App\Processes\Grammar\Lines\ShellSource;
use App\Processes\Grammar\Syntax\ShellLexer;

/**
 * Splits a source into tokens and reads its here-document bodies; text that cannot be read stops the analysis with the
 * lexer's own reason, the size limit, the time limit or the invalid text, at the byte in the whole line.
 */
final readonly class ScanTokens implements Pipe
{
    public function __construct(private ShellLexer $lexer) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(ShellSource $source): ScannedSource
    {
        $lexed = $this->lexer->lex($source->text, $source->draft->dialect);

        if ($lexed->outcome !== ParseOutcome::Complete) {
            throw ShellGrammarStopped::fromLexedLine($lexed, $source->offset);
        }

        return new ScannedSource($source, $lexed->tokens);
    }
}
