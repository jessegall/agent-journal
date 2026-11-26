<?php

declare(strict_types=1);

namespace App\Messages\Contracts;

/**
 * Something that takes part in messages, named by its type and id: who sent a message, or who reads one.
 */
interface MessageParticipant
{
    /**
     * The stored type of the participant, such as user or agent.
     */
    public function participantType(): string;

    /**
     * The id of the participant within its type.
     */
    public function participantId(): string;
}
