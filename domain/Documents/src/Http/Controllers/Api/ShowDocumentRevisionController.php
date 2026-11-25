<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Support\RecordReference;
use Domain\Documents\Api\ShowDocumentRevisionPayload;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Data\RevisionView;

/**
 * Answers one revision of a document.
 */
final readonly class ShowDocumentRevisionController
{
    public function __invoke(ShowDocumentRevisionPayload $call, DocumentResolver $documents): RevisionView
    {
        return $documents->revision(RecordReference::number($call->number), $call->revision);
    }
}
