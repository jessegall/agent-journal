<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\AnalysisLimit;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\ShellLineUnreadable;
use App\Processes\Values\TreeDiagnostic;

/**
 * Splits one shell line into tokens without running anything (doc 21 revision 3, section 5). Quoting is decided here:
 * a quoted separator is data, an escaped $ is literal, single quotes expand nothing. Here-document bodies are read
 * after
 * the line that names them, in order. It keeps no state between calls; every call runs its own LexerScan.
 */
final class ShellLexer
{
    public function lex(string $source, ShellDialect $dialect): LexedLine
    {
        if (AnalysisLimit::SourceBytes->isPassedBy(strlen($source))) {
            $tooLong = ShellLineUnreadable::pastLimit(AnalysisLimit::SourceBytes, AnalysisLimit::SourceBytes->value);

            return new LexedLine(
                ParseOutcome::LimitExceeded,
                [],
                new TreeDiagnostic($tooLong->position, $tooLong->getMessage()),
            );
        }

        try {
            return new LexedLine(ParseOutcome::Complete, new LexerScan($source, $dialect, new TimeBudget())->tokens());
        } catch (ShellLineUnreadable $unreadable) {
            return new LexedLine(
                $unreadable->isLimit ? ParseOutcome::LimitExceeded : ParseOutcome::Invalid,
                [],
                new TreeDiagnostic($unreadable->position, $unreadable->getMessage()),
            );
        }
    }
}
