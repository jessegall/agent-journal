<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\RecordHeartbeatHandler;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Records a heartbeat of a running session at the database server's time; an ended, revoked or retired one is refused.
 *
 * @implements Command<null>
 */
#[HandledBy(RecordHeartbeatHandler::class)]
final readonly class RecordHeartbeat implements Command
{
    public function __construct(public string $sessionId) {}
}
