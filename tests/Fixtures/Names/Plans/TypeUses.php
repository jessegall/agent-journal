<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use Closure;
use Tests\Fixtures\Names\Chat\Message;
use Tests\Fixtures\Names\Chat\Notifier;

final class TypeUses
{
    public Message|null $last = null;

    public function keep(Message $message): Message|Notifier
    {
        return $message;
    }

    public function keeper(): Closure
    {
        return fn (Message $message): Message => $message;
    }
}
