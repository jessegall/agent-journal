<?php

declare(strict_types=1);

namespace App\Contracts\Inboxes;

/**
 * A place messages are addressed to, such as an agent's inbox, by its stable id.
 */
interface LabeledInbox
{
    /**
     * The id messages to this inbox are addressed to.
     */
    public function inboxId(): string;
}
