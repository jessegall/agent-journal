<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Ui\Contracts\PageResolver;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\LibraryData;
use Domain\Documents\Http\Requests\ListRecordsRequest;

/**
 * The library: the newest documents and reports, read through their readers.
 */
final readonly class LibraryWindowResolver implements PageResolver
{
    public const string SHARING_NOTICE = 'Documents and reports are shared with every agent and user of this journal; linked private records stay private.';

    public function __construct(private DocumentResolver $documents, private ReportResolver $reports, private ListRecordsRequest $request) {}

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
