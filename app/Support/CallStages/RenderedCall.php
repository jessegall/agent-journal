<?php

declare(strict_types=1);

namespace App\Support\CallStages;

use App\Models\AgentStackRow;
use App\Support\Drivers\DriverReply;
use App\Support\Stack\HookAnswer;

/**
 * A hook call with the reply the driver gets, ready to be saved with its stack.
 */
final readonly class RenderedCall
{
    public function __construct(
        public HookCallStage $call,
        public AgentStackRow $row,
        public HookAnswer $answer,
        public DriverReply $reply,
    ) {}
}
