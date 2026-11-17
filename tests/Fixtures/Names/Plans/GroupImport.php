<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use Tests\Fixtures\Names\Chat\{ChatFailed, Message};

final class GroupImport
{
    public function failure(Message $message): ChatFailed
    {
        return new ChatFailed((string) $message::LIMIT);
    }
}
