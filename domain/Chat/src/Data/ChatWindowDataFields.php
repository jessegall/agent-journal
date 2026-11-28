<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

final class ChatWindowDataFields extends ChatFields
{
    public function finish(): ChatWindowData
    {
        return $this->complete(ChatWindowData::class);
    }
}
