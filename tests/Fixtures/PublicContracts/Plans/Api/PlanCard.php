<?php

declare(strict_types=1);

namespace Tests\Fixtures\PublicContracts\Plans\Api;

use Tests\Fixtures\PublicContracts\Plans\TaskRow;

final readonly class PlanCard
{
    /**
     * @param  list<TaskRow>  $rows
     */
    public function __construct(public array $rows) {}
}
