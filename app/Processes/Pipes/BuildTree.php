<?php

declare(strict_types=1);

namespace App\Processes\Pipes;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Support\Pipelines;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Stages\ReadSource;
use App\Processes\Stages\ScannedSource;
use App\Processes\Syntax\ShellGrammar;
use App\Processes\Syntax\ShellLexer;

/**
 * Reads a scanned source into the draft with the shell grammar; the grammar sends each substitution it meets through
 * the line pipeline again.
 */
final readonly class BuildTree implements Pipe
{
    public function __construct(private Pipelines $pipelines, private ShellLexer $lexer) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(ScannedSource $scanned): ReadSource
    {
        return new ShellGrammar($this->pipelines, $this->lexer, $scanned)->read();
    }
}
