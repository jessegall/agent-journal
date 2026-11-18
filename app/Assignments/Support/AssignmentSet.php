<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The assignments of the records a read asked for, at most one per record. A record with no visible assignment is
 * simply absent; callers ask forRecord and never build keys of their own (doc 13 section 28, kept as a public list
 * because exported values hold no private state).
 */
final readonly class AssignmentSet
{
    /**
     * @param  list<Assignment>  $assignments
     */
    public function __construct(public array $assignments) {}

    /**
     * @return Option<Assignment>
     */
    public function forRecord(RecordIdentity $record): Option
    {
        foreach ($this->assignments as $assignment) {
            if ($assignment->isFor($record)) {
                return Some::create($assignment);
            }
        }

        return None::create();
    }
}
