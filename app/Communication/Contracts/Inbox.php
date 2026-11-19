<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

/**
 * A place messages are addressed to, such as a desk's inbox: its stable id and the one label its provider owns.
 */
interface Inbox
{
    public function inboxId(): string;

    public function inboxLabel(): string;
}
