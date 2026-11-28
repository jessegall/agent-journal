<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\NodeType;
use App\Processes\Grammar\SimpleCommandDraft;
use App\Processes\Grammar\SimpleCommandParts;
use App\Processes\Grammar\UnparsedCommand;
use App\Processes\Grammar\Values\SourceRange;

/**
 * Opens the node of a simple command at the cursor and counts it as an executable part.
 */
final readonly class OpenSimpleCommandNode implements Pipe
{
    public function handle(UnparsedCommand $toParse): SimpleCommandDraft
    {
        $draft = $toParse->draft();
        $start = $toParse->cursor()->position();
        $draft->countExecutablePart($start);
        $node = $draft->add(NodeType::SimpleCommand, new SourceRange($start, $start), null);

        return new SimpleCommandDraft($toParse, SimpleCommandParts::startAt($node, $start), false);
    }
}
