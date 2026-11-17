<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use Closure;
use Tests\Fixtures\Names\Chat\Message;

final class StaticUses
{
    public function limit(): int
    {
        return Message::LIMIT + Message::$count;
    }

    /**
     * @return array{Message, Closure}
     */
    public function creators(): array
    {
        return [Message::create(), Message::create(...)];
    }
}
