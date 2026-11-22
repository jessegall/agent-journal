<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\CommandToParse;
use App\Support\Grammar\FunctionToParse;

/**
 * Steps past name () before a function body.
 */
final readonly class SkipNamedFunctionHeader implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CommandToParse $toParse): FunctionToParse
    {
        return FunctionToParse::afterHeader($toParse, 3);
    }
}
