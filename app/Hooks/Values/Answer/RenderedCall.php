<?php

declare(strict_types=1);

namespace App\Hooks\Values\Answer;

use App\Hooks\Models\AgentStackRow;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Stack\HookAnswer;

/**
 * A hook call with the reply the program gets, ready to be saved with its stack.
 */
final readonly class RenderedCall
{
    public function __construct(
        public HookCallStage $call,
        public AgentStackRow $row,
        public HookAnswer $answer,
        public ProgramReply $reply,
    ) {}
}
