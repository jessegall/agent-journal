<?php

declare(strict_types=1);

namespace App\Stacks\Support;

use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;

/**
 * Builds the reading state of one inbox for one agent; the state finds the messages there it has not read itself.
 */
final class ReadMessageStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'core.messages.read';
    }

    public static function forInbox(string $inboxId, string $agentId): StateReference
    {
        return self::about(new SubjectReference($inboxId, 0), ['inboxId' => $inboxId, 'agentId' => $agentId]);
    }
}
