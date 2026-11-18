<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use App\Text\Support\MarkdownText;
use App\Ui\Contracts\PageReader;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Data\RevisionPageData;
use Domain\Documents\Http\Requests\RevisionPageRequest;

/**
 * One revision's page: its text as safe HTML, marked historical when a later revision exists.
 */
final readonly class RevisionWindowReader implements PageReader
{
    public function __construct(private RevisionPageRequest $request, private DocumentReader $documents) {}

    public function read(): RevisionPageData
    {
        $revision = $this->documents->revision($this->request->documentNumber(), $this->request->revisionNumber());

        return RevisionPageData::from([
            'documentNumber' => $revision->documentNumber,
            'number' => $revision->number,
            'title' => $revision->title,
            'abstract' => $revision->abstract,
            'bodyHtml' => MarkdownText::body($revision->body)->toSafeHtml(),
            'historical' => $revision->historical,
        ]);
    }
}
