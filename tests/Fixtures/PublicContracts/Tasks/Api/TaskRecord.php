<?php

declare(strict_types=1);

namespace Tests\Fixtures\PublicContracts\Tasks\Api;

final readonly class TaskRecord
{
    public function __construct(public string $id) {}
}
