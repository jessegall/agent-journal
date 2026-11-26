<?php

declare(strict_types=1);

namespace App\Inboxes\Commands\OpenInbox;

use App\Support\ActorReference;
use App\Support\Command;

/**
 * Finds the inbox a provider knows by its id, or opens it under the label, and attaches every member not attached yet;
 * returns the inbox's id.
 *
 * @extends Command<string>
 */
final readonly class OpenInboxCommand extends Command
{
    /**
     * @param  list<ActorReference>  $members
     */
    public function __construct(
        public string $providerKey,
        public string $providerId,
        public string $label,
        public array $members,
    ) {}
}
