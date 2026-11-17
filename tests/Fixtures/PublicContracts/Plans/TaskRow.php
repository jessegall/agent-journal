<?php

declare(strict_types=1);

namespace Tests\Fixtures\PublicContracts\Plans;

final readonly class TaskRow
{
    public function __construct(public string $title) {}
}
