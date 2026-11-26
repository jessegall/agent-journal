<?php

declare(strict_types=1);

namespace App\Inboxes\Commands\LeaveInbox;

use App\Support\ActorReference;
use App\Support\Command;

/**
 * Detaches each of the actors from the inbox, in one write.
 *
 * @extends Command<null>
 */
final readonly class LeaveInboxCommand extends Command
{
    /**
     * @param  list<ActorReference>  $actors
     */
    public function __construct(public string $inboxId, public array $actors) {}
}
