<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Fixtures\Docking;

use App\Records\Contracts\SummaryProvider;
use App\Records\Values\RecordSummary;
use App\Values\ProjectOwner;

/**
 * Summarizes fixture records: every id exists, every viewer may read it, and each is titled by its id.
 */
final readonly class FixtureSummaries implements SummaryProvider
{
    public function requireReadable(string $id): RecordSummary
    {
        return new RecordSummary($id, $id);
    }

    public function ownerOf(string $id): ProjectOwner
    {
        return ProjectOwner::global();
    }

    public function visibleSummaries(array $ids): array
    {
        return array_map(fn (string $id) => new RecordSummary($id, $id), $ids);
    }
}
