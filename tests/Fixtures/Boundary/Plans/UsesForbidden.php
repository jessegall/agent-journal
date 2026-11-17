<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Plans;

use Tests\Fixtures\Boundary\Chat\Message;
use Tests\Fixtures\Boundary\Outside\Helper;
use Tests\Fixtures\Boundary\PlansExtra\Thing;

final class UsesForbidden
{
    /**
     * @return list<object|string>
     */
    public function forbidden(): array
    {
        return [new Message, new Helper, new Thing, 'tests\fixtures\boundary\chat\Message'];
    }
}
