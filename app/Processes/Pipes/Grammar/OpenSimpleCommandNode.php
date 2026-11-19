<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\NodeType;
use App\Processes\Values\Grammar\CommandToParse;
use App\Processes\Values\Grammar\SimpleCommandDraft;
use App\Processes\Values\Grammar\SimpleCommandParts;
use App\Processes\Values\SourceRange;

/**
 * Opens the node of a simple command at the cursor and counts it as an executable part.
 */
final readonly class OpenSimpleCommandNode implements Pipe
{
    public function handle(CommandToParse $toParse): SimpleCommandDraft
    {
        $draft = $toParse->draft();
        $start = $toParse->cursor()->position();
        $node = $draft->add(NodeType::SimpleCommand, new SourceRange($start, $start), null);
        $draft->countExecutablePart($start);

        return new SimpleCommandDraft($toParse, SimpleCommandParts::startAt($node, $start), false);
    }
}
