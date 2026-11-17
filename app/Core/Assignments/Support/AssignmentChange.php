<?php

declare(strict_types=1);

namespace App\Core\Assignments\Support;

use PhpOption\Option;

/**
 * One record whose holder actually changed, with its assignment before and after.
 */
final readonly class AssignmentChange
{
    /**
     * @param  Option<Assignment>  $before
     * @param  Option<Assignment>  $after
     */
    public function __construct(
        public RecordIdentity $record,
        public Option $before,
        public Option $after,
    ) {}
}
