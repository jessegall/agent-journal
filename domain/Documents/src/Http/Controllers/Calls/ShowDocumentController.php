<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Numbers\Support\RecordReference;
use Domain\Documents\Calls\ShowDocumentCall;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Data\RecordText;

/**
 * Answers the part of a document's text asked for.
 */
final readonly class ShowDocumentController
{
    public function __invoke(ShowDocumentCall $call, DocumentResolver $documents): RecordText
    {
        $number = RecordReference::number($call->number);

        return $documents->read($number, $call->selection, $call->revision, $call->atRevision);
    }
}
