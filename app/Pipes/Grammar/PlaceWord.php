<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\NodeType;
use App\Enums\WordPlace;
use App\Support\Grammar\UnparsedWord;

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
