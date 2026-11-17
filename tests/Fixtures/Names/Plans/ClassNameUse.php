<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use Tests\Fixtures\Names\Chat\Message;

final class ClassNameUse
{
    public function className(): string
    {
        return Message::class;
    }
}
