<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use App\Ui\Contracts\PageReader;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\LibraryData;
use Domain\Documents\Http\Requests\ListRecordsRequest;

/**
 * The library: the newest documents and reports, read through their readers.
 */
final readonly class LibraryWindowReader implements PageReader
{
    public const string SHARING_NOTICE = 'Documents and reports are shared with every agent and user of this journal; linked private records stay private.';

    public function __construct(private DocumentReader $documents, private ReportReader $reports, private ListRecordsRequest $request) {}

    public function read(): LibraryData
    {
        $filters = $this->request->filters();

        return LibraryData::from([
            'documents' => $this->documents->list($filters),
            'reports' => $this->reports->list($filters),
            'sharingNotice' => self::SHARING_NOTICE,
            'query' => $filters->query,
            'attention' => $filters->attention,
        ]);
    }
}
