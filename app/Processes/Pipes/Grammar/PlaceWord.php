<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\WordPlace;
use App\Processes\Values\Grammar\WordToParse;

/**
 * A word before the first argument that starts as NAME= becomes an Assignment node of the command; any other word is
 * an argument.
 */
final readonly class PlaceWord implements Pipe
{
    public function handle(WordToParse $toParse): WordToParse
    {
        if ($toParse->place !== WordPlace::Unread) {
            return $toParse;
        }
        if (! $toParse->isBeforeArguments || ! $toParse->word->isAssignment()) {
            return $toParse->placedAs(WordPlace::Argument);
        }
        $draft = $toParse->draft();
        $assignment = $draft->add(NodeType::Assignment, $toParse->word->range, $toParse->command);
        $draft->setWords($assignment, [$toParse->word]);

        return $toParse->placedAs(WordPlace::Assignment);
    }
}
