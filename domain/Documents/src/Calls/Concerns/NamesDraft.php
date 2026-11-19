<?php

declare(strict_types=1);

namespace Domain\Documents\Calls\Concerns;

use App\Numbers\Support\RecordReference;
use Domain\Documents\Api\DraftTarget;

/**
 * A call about the caller's draft of a document, named by the document's number, the draft's token and its version.
 */
trait NamesDraft
{
    public function target(): DraftTarget
    {
        return new DraftTarget(RecordReference::number($this->number), $this->token, $this->version);
    }
}
