<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\UnparsedCommand;
use App\Support\Grammar\UnparsedFunction;

/**
 * Steps past name () before a function body.
 */
final readonly class SkipNamedFunctionHeader implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(UnparsedCommand $toParse): UnparsedFunction
    {
        return UnparsedFunction::afterHeader($toParse, 3);
    }
}
