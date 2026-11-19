<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\NodeType;
use App\Processes\Values\Grammar\CommandReading;
use App\Processes\Values\Grammar\SimpleCommandBeingRead;
use App\Processes\Values\Grammar\SimpleCommandParts;
use App\Processes\Values\SourceRange;

/**
 * Opens the node of a simple command at the cursor and counts it as an executable part.
 */
final readonly class OpenSimpleCommandNode implements Pipe
{
    public function handle(CommandReading $reading): SimpleCommandBeingRead
    {
        $draft = $reading->draft();
        $start = $reading->cursor()->position();
        $node = $draft->add(NodeType::SimpleCommand, new SourceRange($start, $start), null);
        $draft->countExecutablePart($start);

        return new SimpleCommandBeingRead($reading, SimpleCommandParts::startAt($node, $start), false);
    }
}
