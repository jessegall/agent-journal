<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Contracts\CommandReader;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\UnsupportedConstructs;
use App\Processes\Values\Grammar\CommandReading;
use App\Processes\Values\Grammar\NodeRead;

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
    public function handle(CommandReading $reading): NodeRead
    {
        return new NodeRead($this->unsupported->skip($reading->context, $this->reason(), null));
    }

    abstract protected function reason(): string;
}
