<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

/**
 * A place messages are addressed to, such as a desk's inbox: its stable id and the one label its provider owns.
 */
interface Inbox
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
