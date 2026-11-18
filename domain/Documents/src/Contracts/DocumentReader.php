<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\DocumentList;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Readers\DocumentRecords;
use Illuminate\Container\Attributes\Bind;

/**
 * Reads the published documents: a page of them, or one by its number with its current text.
 */
#[Bind(DocumentRecords::class)]
interface DocumentReader
{
    public function list(DocumentFilters $filters): DocumentList;

    /**
     * @throws DocumentMissing
     */
    public function show(int $number): DocumentView;
}
