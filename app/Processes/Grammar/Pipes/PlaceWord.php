<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\NodeType;
use App\CommandRules\Enums\WordPlace;
use App\Processes\Grammar\UnparsedWord;

/**
 * A word before the first argument that starts as NAME= becomes an Assignment node of the command; any other word is
 * an argument.
 */
final readonly class PlaceWord implements Pipe
{
    public function handle(UnparsedWord $toParse): UnparsedWord
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
