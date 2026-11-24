<?php

declare(strict_types=1);

namespace App\Contracts\Inboxes;

/**
 * A place messages are addressed to, such as a desk's inbox: its stable id and the one label its provider owns.
 */
interface LabeledInbox
{
    /**
     * The id messages to this inbox are addressed to.
     */
    public function inboxId(): string;

    /**
     * The name users see for the inbox.
     */
    public function inboxLabel(): string;
}
