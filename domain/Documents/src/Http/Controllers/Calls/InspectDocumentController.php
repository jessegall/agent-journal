<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Support\RecordReference;
use Domain\Documents\Calls\InspectDocumentCall;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Data\RecordInspection;

/**
 * Answers the inspection of a document.
 */
final readonly class InspectDocumentController
{
    public function __invoke(InspectDocumentCall $call, DocumentResolver $documents): RecordInspection
    {
        return $documents->inspect(RecordReference::number($call->number));
    }
}
