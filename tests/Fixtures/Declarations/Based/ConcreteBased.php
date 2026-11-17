<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Based;

final class ConcreteBased extends AbstractBasedDomain
{
    public function description(): string
    {
        return 'A fixture domain behind an abstract base with the wrong name.';
    }
}
