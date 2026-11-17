<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use Tests\Fixtures\Names\Chat\Message as ChatMessage;

final class AliasImport
{
    public function message(): ChatMessage
    {
        return ChatMessage::create();
    }
}
