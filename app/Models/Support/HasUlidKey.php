<?php

declare(strict_types=1);

namespace App\Models\Support;

use Illuminate\Database\Eloquent\Concerns\HasUlids;

/**
 * A model keyed by a ULID: its key is always a string, made the first time it is asked for when the row is new.
 */
trait HasUlidKey
{
    use HasUlids;

    public function getKey(): string
    {
        if ($this->getAttribute($this->getKeyName()) === null) {
            $this->setUniqueIds();
        }

        return strval($this->getAttribute($this->getKeyName()));
    }
}
