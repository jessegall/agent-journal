<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Support\RecordReference;
use Domain\Documents\Calls\ShowDocumentRevisionCall;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Data\RevisionView;

/**
 * Answers one revision of a document.
 */
final readonly class ShowDocumentRevisionController
{
    public function __invoke(ShowDocumentRevisionCall $call, DocumentResolver $documents): RevisionView
    {
        return $documents->revision(RecordReference::number($call->number), $call->revision);
    }
}
