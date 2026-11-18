<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

final class FullyWritten
{
    public function message(): \Tests\Fixtures\Names\Chat\Message
    {
        return new \Tests\Fixtures\Names\Chat\Message;
    }
}
