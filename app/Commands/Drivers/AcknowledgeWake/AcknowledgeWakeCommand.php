<?php

declare(strict_types=1);

namespace App\Commands\Drivers\AcknowledgeWake;

use App\Support\Command;

/**
 * Acknowledges the wakes the host claimed for the session's runtime with the session's activity now: a hook call of the
 * session is activity after its wake was taken. Run by the hook endpoint for the agent whose hook it answers.
 *
 * @extends Command<null>
 */
final readonly class AcknowledgeWakeCommand extends Command
{
    public function __construct(public string $sessionId) {}
}
