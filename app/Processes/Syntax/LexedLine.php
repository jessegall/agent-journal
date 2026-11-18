<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\ParseOutcome;
use App\Processes\Values\TreeDiagnostic;

/**
 * The tokens of one shell line, or why it could not be read: an unfinished quote, substitution or here-document is
 * Invalid, a line past the analysis limits is LimitExceeded, and in both cases the diagnostic names the position.
 */
final readonly class LexedLine
{
    /**
     * @param  list<Token>  $tokens
     */
    public function __construct(
        public ParseOutcome $outcome,
        public array $tokens,
        public TreeDiagnostic|null $diagnostic = null,
    ) {}
}
