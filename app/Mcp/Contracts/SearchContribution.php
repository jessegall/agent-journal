<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Data\SearchPage;
use App\Values\ReadRequest;

interface SearchContribution
{
    public const int PAGE_SIZE = 2;

    public function recordType(): string;

    public function readRequest(): ReadRequest;

    public function search(string $query, int $page): SearchPage;
}
