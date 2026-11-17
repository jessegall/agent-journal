<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Plans;

use App\Domain\DomainRegistry;
use Exception;
use Illuminate\Support\Collection;
use Tests\Fixtures\Boundary\Tasks\Task;

final class UsesAllowed
{
    /**
     * @return Collection<int, Task|Plan>
     */
    public function allowed(?DomainRegistry $registry): Collection
    {
        if ($registry === null) {
            throw new Exception('no registry');
        }

        return new Collection([new Task, new Plan]);
    }
}
