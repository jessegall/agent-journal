<?php

declare(strict_types=1);

namespace App\Hooks\Values\Answer;

use App\Agents\Values\StackTarget;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Programs\ProgramCapabilities;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Stack\HookAnswer;
use Closure;

/**
 * One hook call as it enters the answer pipeline: the input, what the program can take, the adapter's way to render
 * the reply, and whose call it is.
 */
final readonly class HookCallStage
{
    /**
     * @param  Closure(HookAnswer): ProgramReply  $render  the program adapter's reply to the final answer
     */
    public function __construct(
        public HookInput $input,
        public ProgramCapabilities $capabilities,
        public Closure $render,
        public HookIdentity $identity,
        public StackTarget $target,
    ) {}

    public function locked(AgentStackRow $row): LockedCall
    {
        return new LockedCall($this, $row);
    }
}
