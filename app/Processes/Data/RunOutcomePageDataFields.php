<?php

declare(strict_types=1);

namespace App\Processes\Data;

use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class RunOutcomePageDataFields
{
    private string $runId;

    private RunOutcomeSummaryData|Optional $summary;

    public function __construct()
    {
        $this->summary = new Optional();
    }

    public function runId(string $runId): self
    {
        $this->runId = $runId;

        return $this;
    }

    public function summary(RunOutcomeSummaryData|Optional $summary): self
    {
        $this->summary = $summary;

        return $this;
    }

    public function finish(): RunOutcomePageData
    {
        if (! isset($this->runId)) {
            throw MissingFields::forType(RunOutcomePageData::class, 'runId');
        }

        return new RunOutcomePageData(
            runId: $this->runId,
            summary: $this->summary,
        );
    }
}
