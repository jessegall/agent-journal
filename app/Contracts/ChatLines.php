<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Enums\LineCardPlacement;
use App\Support\ActorIdentity;
use App\Support\Cards\DockIdentity;
use App\Values\ChatLine;

/**
 * Plain lines in the chats an agent is in, beside their messages: what a domain says the agent does, and the record a
 * line shows as a card.
 */
interface ChatLines
{
    /**
     * Posts the line into every chat the agent is a member of now, in the order it happened.
     */
    public function post(
        ActorIdentity $agent,
        string $subject,
        string $line,
        DockIdentity|null $source = null,
        LineCardPlacement $placement = LineCardPlacement::Inline,
    ): void;

    /**
     * The chat's lines from the given position on, oldest first.
     *
     * @return list<ChatLine>
     */
    public function linesFrom(string $inboxId, int $fromSequence): array;
}
