<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use function Tests\Fixtures\Names\Chat\send_message;

final class FunctionUses
{
    public function send(): void
    {
        send_message();
        \Tests\Fixtures\Names\Chat\send_message();
    }
}
