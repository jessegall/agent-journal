<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The named holders of the records a read asked about; a record without a holder, or whose holder has no name any
 * more, has none.
 */
final readonly class AssignmentHolders
{
    /**
     * @param  list<AssignmentHolder>  $holders
     */
    public function __construct(public array $holders) {}

    /**
     * @return Option<AssignmentHolder>
     */
    public function forRecord(RecordIdentity $record): Option
    {
        foreach ($this->holders as $holder) {
            if ($holder->assignment->isFor($record)) {
                return Some::create($holder);
            }
        }

        return None::create();
    }
}
