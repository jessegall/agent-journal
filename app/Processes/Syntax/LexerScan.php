<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Contracts\PipelineRunner;
use App\Pipelines\Support\Step;
use App\Processes\Enums\ShellDialect;
use App\Processes\Pipes\Lexing\CheckLexerBudget;
use App\Processes\Pipes\Lexing\ReadHereDocumentBodies;
use App\Processes\Pipes\Lexing\ReadLexerComment;
use App\Processes\Pipes\Lexing\ReadLexerNewline;
use App\Processes\Pipes\Lexing\ReadOperatorOrWord;
use App\Processes\Pipes\Lexing\SkipLexerSpace;
use App\Processes\Pipes\Lexing\SkipLineContinuation;

/**
 * Scans one source in token order, then reads any here-document bodies waiting at the end.
 */
final readonly class LexerScan
{
    public function __construct(private PipelineRunner $runner) {}

    /**
     * @return list<Token>
     */
    public function tokens(string $source, ShellDialect $dialect): array
    {
        return $this->runner->runSteps(
            [
                Step::repeated(
                    [CheckLexerBudget::class, Step::resolvedBy(self::nextPipe(...))],
                    while: fn (LexerCursor $cursor) => $cursor->hasBytes(),
                ),
                ReadHereDocumentBodies::class,
            ],
            new LexerCursor($source, $dialect, new TimeBudget()),
            LexerCursor::class,
        )->tokens();
    }

    /**
     * @return class-string<Pipe>
     */
    private static function nextPipe(LexerCursor $cursor): string
    {
        return match ($cursor->current()) {
            ' ', "\t" => SkipLexerSpace::class,
            '\\' => $cursor->at($cursor->position + 1) === "\n"
                ? SkipLineContinuation::class
                : ReadOperatorOrWord::class,
            "\n" => ReadLexerNewline::class,
            '#' => ReadLexerComment::class,
            default => ReadOperatorOrWord::class,
        };
    }
}
