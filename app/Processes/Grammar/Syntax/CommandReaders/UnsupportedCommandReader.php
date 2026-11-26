<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Syntax\CommandReaders;

use App\Bus\Contracts\CommandReader;
use App\Bus\Contracts\Pipe;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Syntax\UnsupportedConstructs;
use App\Processes\Grammar\UnparsedCommand;
use App\Values\AgentText;

/**
 * A reader of a kind of command that is not supported: the command is skipped as one Unsupported node with the
 * reason its kind gives.
 */
abstract readonly class UnsupportedCommandReader implements CommandReader, Pipe
{
    /**
     * Takes the list of shell constructs the parser skips.
     */
    public function __construct(private UnsupportedConstructs $unsupported) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(UnparsedCommand $toParse): NodeRead
    {
        return new NodeRead($this->unsupported->skip($toParse->context, $this->reason(), null));
    }

    /**
     * Why the parser does not read this construct, as the agent is told.
     */
    abstract protected function reason(): AgentText;
}
