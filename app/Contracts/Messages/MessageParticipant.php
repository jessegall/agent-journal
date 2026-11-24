<?php

declare(strict_types=1);

namespace App\Contracts\Messages;

/**
 * Something that takes part in messages, named by its type and id: who sent a message, or who reads one.
 */
interface MessageParticipant
{
    public function participantType(): string;

    public function participantId(): string;
}
