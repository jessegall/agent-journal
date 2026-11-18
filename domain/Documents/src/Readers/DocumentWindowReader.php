<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use App\Ui\Contracts\PageReader;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Data\RecordPageData;
use Domain\Documents\Http\Requests\RecordPageRequest;

/**
 * One document's page, with its current revision rendered to safe HTML.
 */
final readonly class DocumentWindowReader implements PageReader
{
    public function __construct(private RecordPageRequest $request, private DocumentReader $documents) {}

    public function read(): RecordPageData
    {
        return RecordPageData::fromDocumentView($this->documents->show($this->request->documentNumber()));
    }
}
