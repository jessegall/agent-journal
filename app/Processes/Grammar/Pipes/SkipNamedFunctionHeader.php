<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\UnparsedCommand;
use App\Processes\Grammar\UnparsedFunction;

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
