<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Values\Grammar\CommandReading;
use App\Processes\Values\Grammar\FunctionReading;

/**
 * Steps past name () before a function body.
 */
final readonly class SkipNamedFunctionHeader implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CommandReading $reading): FunctionReading
    {
        return FunctionReading::afterHeader($reading, 3);
    }
}
