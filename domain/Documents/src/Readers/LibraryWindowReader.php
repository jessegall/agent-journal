<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use App\Ui\Contracts\PageReader;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\LibraryData;

/**
 * The library: the newest documents and reports, read through their readers.
 */
final readonly class LibraryWindowReader implements PageReader
{
    public const string SHARING_NOTICE = 'Documents and reports are shared with every agent and user of this journal; linked private records stay private.';

    public function __construct(private DocumentReader $documents, private ReportReader $reports) {}

    public function read(): LibraryData
    {
        return new LibraryData($this->documents->list(new DocumentFilters), $this->reports->list(new DocumentFilters), self::SHARING_NOTICE);
    }
}
