<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Support\RecordReference;
use Domain\Documents\Api\InspectDocumentPayload;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Data\RecordInspection;

/**
 * Answers the inspection of a document.
 */
final readonly class InspectDocumentController
{
    public function __invoke(InspectDocumentPayload $call, DocumentResolver $documents): RecordInspection
    {
        return $documents->inspect(RecordReference::number($call->number));
    }
}
