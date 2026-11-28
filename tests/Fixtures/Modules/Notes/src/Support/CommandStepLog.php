<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use Illuminate\Container\Attributes\Scoped;

/**
 * The order the fixture middleware ran in, for the bus tests to read.
 */
#[Scoped]
final class CommandStepLog
{
    /**
     * @var list<string>
     */
    public array $steps = [];

    public function add(string $step): void
    {
        $this->steps[] = $step;
    }
}
