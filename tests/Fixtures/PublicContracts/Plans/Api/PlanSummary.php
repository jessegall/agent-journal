<?php

declare(strict_types=1);

namespace Tests\Fixtures\PublicContracts\Plans\Api;

use Tests\Fixtures\PublicContracts\Tasks\Api\TaskRecord;

final readonly class PlanSummary
{
    public function __construct(public string $title) {}

    public function firstTask(): TaskRecord
    {
        return new TaskRecord(1);
    }
}
