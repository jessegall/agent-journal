<?php

declare(strict_types=1);

namespace App\Processes\Pipes;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\ShellLexer;
use App\Processes\Values\Lines\ScannedSource;
use App\Processes\Values\Lines\ShellSource;

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
