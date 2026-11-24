<?php

declare(strict_types=1);

namespace App\Support;

use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The assignments of the records a read asked for, at most one per record. A record with no visible assignment is
 * simply absent; callers ask forRecord and never build keys of their own.
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
