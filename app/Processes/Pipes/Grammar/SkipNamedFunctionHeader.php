<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Values\Grammar\CommandToParse;
use App\Processes\Values\Grammar\FunctionToParse;

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
