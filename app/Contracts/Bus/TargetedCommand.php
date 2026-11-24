<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

/**
 * A command whose receipt keeps what it wrote to, such as the inboxes of a send or the message of a reply, so a
 * later lookup by its key answers only a caller that names the same target.
 */
interface TargetedCommand
{
    /**
     * The key the command's receipt is kept under, so a repeat of it finds the first outcome.
     */
    public function receiptTarget(): string;
}
