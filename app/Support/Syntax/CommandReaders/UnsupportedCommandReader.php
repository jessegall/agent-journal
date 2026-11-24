<?php

declare(strict_types=1);

namespace App\Support\Syntax\CommandReaders;

use App\Contracts\Bus\CommandReader;
use App\Contracts\Bus\Pipe;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\CommandToParse;
use App\Support\Grammar\NodeRead;
use App\Support\Syntax\UnsupportedConstructs;
use App\Values\AgentText;

/**
 * A reader of a kind of command that is not supported: the command is skipped as one Unsupported node with the
 * reason its kind gives.
 */
abstract readonly class UnsupportedCommandReader implements CommandReader, Pipe
{
    public function __construct(private UnsupportedConstructs $unsupported) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CommandToParse $toParse): NodeRead
    {
        return new NodeRead($this->unsupported->skip($toParse->context, $this->reason(), null));
    }

    abstract protected function reason(): AgentText;
}
