<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use Tests\Fixtures\Names\Chat\Message;

final class FullyWritten
{
    public function message(): Message
    {
        return new Message();
    }
}
