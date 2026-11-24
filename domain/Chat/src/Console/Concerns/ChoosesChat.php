<?php

declare(strict_types=1);

namespace Domain\Chat\Console\Concerns;

/**
 * Reads the conversation a dock command names with --chat, or none, so the journal uses the only one the caller has.
 */
trait ChoosesChat
{
    private function chosenChat(): string|null
    {
        $chat = $this->option('chat');

        if (is_string($chat) && $chat !== '') {
            return $chat;
        }

        return null;
    }
}
