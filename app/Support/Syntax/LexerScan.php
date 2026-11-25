<?php

declare(strict_types=1);

namespace App\Support\Syntax;

use App\Contracts\Bus\Pipe;
use App\Contracts\Bus\PipelineRunner;
use App\Enums\Processes\ShellDialect;
use App\Pipes\Lexing\CheckLexerBudget;
use App\Pipes\Lexing\ReadHereDocumentBodies;
use App\Pipes\Lexing\ReadLexerComment;
use App\Pipes\Lexing\ReadLexerNewline;
use App\Pipes\Lexing\ReadOperatorOrWord;
use App\Pipes\Lexing\SkipLexerSpace;
use App\Pipes\Lexing\SkipLineContinuation;
use App\Support\Step;

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
                    [
                        CheckLexerBudget::class,
                        Step::resolvedBy(self::nextPipe(...)),
                    ],
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
