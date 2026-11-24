<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Enums\OutputStream;
use App\Enums\RecordRole;
use App\Values\OutputRecord;
use Spatie\LaravelData\Data;

/**
 * An output record as it is stored, the shape OutputRecord::toArray writes: its stream, byte range, role and captures.
 */
final class StoredOutputRecord extends Data
{
    /**
     * @param  array<string, string>  $captures
     */
    public function __construct(
        public readonly OutputStream $stream,
        public readonly int $start,
        public readonly int $end,
        public readonly RecordRole $role,
        public readonly array $captures,
    ) {}

    public function record(): OutputRecord
    {
        return new OutputRecord($this->stream, $this->start, $this->end, $this->role, $this->captures);
    }
}
