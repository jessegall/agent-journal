<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\CommandReaders\CommandReaderResolver;
use App\Processes\Values\Grammar\CommandReading;
use App\Processes\Values\Grammar\NodeRead;

/**
 * Reads the command at the cursor with the reader for its kind.
 */
final readonly class ReadCommand implements Pipe
{
    public function __construct(private CommandReaderResolver $readers) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CommandReading $reading): NodeRead
    {
        return new NodeRead($this->readers->readerFor($reading->cursor())->read($reading));
    }
}
