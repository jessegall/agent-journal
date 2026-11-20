<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Agents\Values\ReadRequest;
use App\Mcp\Data\SearchPage;

interface SearchContribution
{
    public const int PAGE_SIZE = 2;

    public function recordType(): string;

    public function readRequest(): ReadRequest;

    public function search(string $query, int $page): SearchPage;
}
