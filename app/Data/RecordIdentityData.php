<?php

declare(strict_types=1);

namespace App\Data;

use App\Support\RecordIdentity;
use Spatie\LaravelData\Data;

/**
 * A record's type and id as stored in a JSON column, read back as its RecordIdentity.
 */
final class RecordIdentityData extends Data
{
    public function __construct(
        public readonly string $type,
        public readonly string $id,
    ) {}

    public function identity(): RecordIdentity
    {
        return new RecordIdentity($this->type, $this->id);
    }
}
