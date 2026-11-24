<?php

declare(strict_types=1);

namespace App\Support\Syntax;

use App\Enums\AnalysisLimit;
use App\Enums\ParseOutcome;
use App\Enums\ShellDialect;
use App\Exceptions\ShellLineUnreadable;
use App\Values\TreeDiagnostic;

/**
 * Splits one shell line into tokens without running anything. Quoting is decided here:
 * a quoted separator is data, an escaped $ is literal, single quotes expand nothing. Here-document bodies are read
 * after the line that names them, in order. Each call starts a fresh cursor.
 */
final readonly class ShellLexer
{
    public function __construct(private LexerScan $scan) {}

    public function lex(string $source, ShellDialect $dialect): LexedLine
    {
        if (AnalysisLimit::SourceBytes->isPassedBy(strlen($source))) {
            $tooLong = ShellLineUnreadable::pastLimit(AnalysisLimit::SourceBytes, AnalysisLimit::SourceBytes->value);

            return new LexedLine(
                ParseOutcome::LimitExceeded,
                [],
                new TreeDiagnostic($tooLong->position, $tooLong->reason),
            );
        }

        try {
            return new LexedLine(ParseOutcome::Complete, $this->scan->tokens($source, $dialect));
        } catch (ShellLineUnreadable $unreadable) {
            return new LexedLine(
                $unreadable->isLimit ? ParseOutcome::LimitExceeded : ParseOutcome::Invalid,
                [],
                new TreeDiagnostic($unreadable->position, $unreadable->reason),
            );
        }
    }
}
