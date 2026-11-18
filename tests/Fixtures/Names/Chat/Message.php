<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Chat;

class Message
{
    public const int LIMIT = 10;

    public static int $count = 0;

    public static function create(): self
    {
        return new self();
    }
}
