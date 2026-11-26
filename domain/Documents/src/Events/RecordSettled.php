<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Navigation\Contracts\ClientUpdate;
use App\Records\Contracts\RecordChanged;

/**
 * A document or report was settled as needing no more attention. It carries ids only.
 */
final readonly class RecordSettled implements ClientUpdate, DocumentEvent, RecordChanged
{
    public function __construct(public string $recordType, public string $recordId) {}

    public function recordType(): string
    {
        return $this->recordType;
    }

    public function recordId(): string
    {
        return $this->recordId;
    }
}
