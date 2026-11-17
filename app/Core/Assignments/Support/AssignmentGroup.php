<?php

declare(strict_types=1);

namespace App\Core\Assignments\Support;

use App\Core\Assignments\Exceptions\AssignmentGroupTooLarge;

/**
 * The records one batch command covers: its root and every record under it that its owner collected, the root once
 * and each record once, at most 1,000 in all.
 */
final readonly class AssignmentGroup
{
    public const int LARGEST = 1000;

    /**
     * @var list<RecordIdentity>
     */
    public array $records;

    /**
     * @param  list<RecordIdentity>  $records
     *
     * @throws AssignmentGroupTooLarge
     */
    public function __construct(
        public RecordIdentity $root,
        array $records,
    ) {
        $unique = [$root];

        foreach ($records as $record) {
            if (! array_any($unique, fn (RecordIdentity $kept) => $kept->isSameAs($record))) {
                $unique[] = $record;
            }
        }

        if (count($unique) > self::LARGEST) {
            throw AssignmentGroupTooLarge::for(count($unique));
        }

        $this->records = $unique;
    }
}
