<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Support\RecordIdentity;
use App\Web\Creation\Exceptions\MissingFields;

final class RecordLayoutDataFields
{
    private DeclaredLayoutData $shown;

    private RecordIdentity $record;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function record(RecordIdentity $record): self
    {
        $this->record = $record;

        return $this;
    }

    public function finish(): RecordLayoutData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(RecordLayoutData::class, 'shown');
        }

        if (! isset($this->record)) {
            throw MissingFields::forType(RecordLayoutData::class, 'record');
        }

        return new RecordLayoutData(
            shown: $this->shown,
            record: $this->record,
        );
    }
}
