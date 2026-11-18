<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\WordPlace;
use App\Processes\Values\Grammar\WordReading;

/**
 * A word before the first argument that starts as NAME= becomes an Assignment node of the command; any other word is
 * an argument.
 */
final readonly class PlaceWord implements Pipe
{
    public function handle(WordReading $reading): WordReading
    {
        if ($reading->place !== WordPlace::Unread) {
            return $reading;
        }
        if (! $reading->isBeforeArguments || ! $reading->word->isAssignment()) {
            return $reading->placedAs(WordPlace::Argument);
        }
        $draft = $reading->draft();
        $assignment = $draft->add(NodeType::Assignment, $reading->word->range, $reading->command);
        $draft->setWords($assignment, [$reading->word]);

        return $reading->placedAs(WordPlace::Assignment);
    }
}
