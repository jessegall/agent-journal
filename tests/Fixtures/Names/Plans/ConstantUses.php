<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use const Tests\Fixtures\Names\Chat\MAX_LENGTH;

final class ConstantUses
{
    /**
     * @return list<int>
     */
    public function lengths(): array
    {
        return [MAX_LENGTH, \Tests\Fixtures\Names\Chat\MAX_LENGTH];
    }
}
