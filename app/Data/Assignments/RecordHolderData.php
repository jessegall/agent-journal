<?php

declare(strict_types=1);

namespace App\Data\Assignments;

use App\Support\AssignmentData;
use App\Support\AssignmentHolder;
use App\Support\RecordIdentity;
use PhpOption\Option;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * A record and who holds it now; a record nobody holds has no holder key.
 */
final class RecordHolderData extends Data
{
    public function __construct(
        public readonly string $recordType,
        public readonly string $recordId,
        public readonly AssignmentData|Optional $holder = new Optional(),
    ) {}

    /**
     * @param  Option<AssignmentHolder>  $holder
     */
    public static function of(RecordIdentity $record, Option $holder): self
    {
        return new self(
            $record->type,
            $record->id,
            $holder->map(AssignmentData::ofHolder(...))->getOrElse(Optional::create()),
        );
    }
}
