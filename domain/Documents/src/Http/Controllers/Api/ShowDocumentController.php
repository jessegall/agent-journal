<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Support\RecordReference;
use Domain\Documents\Api\ShowDocumentPayload;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Data\RecordText;

/**
 * Answers the part of a document's text asked for.
 */
final readonly class ShowDocumentController
{
    public function __invoke(ShowDocumentPayload $call, DocumentResolver $documents): RecordText
    {
        $number = RecordReference::number($call->number);

        return $documents->read($number, $call->selection, $call->revision, $call->atRevision);
    }
}
