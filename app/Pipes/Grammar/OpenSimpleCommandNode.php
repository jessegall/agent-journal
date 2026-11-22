<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\NodeType;
use App\Support\Grammar\CommandToParse;
use App\Support\Grammar\SimpleCommandDraft;
use App\Support\Grammar\SimpleCommandParts;
use App\Values\SourceRange;

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
