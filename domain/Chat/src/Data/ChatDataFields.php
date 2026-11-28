<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

final class ChatDataFields extends ChatFields
{
    public function finish(): ChatData
    {
        return $this->complete(ChatData::class);
    }
}
