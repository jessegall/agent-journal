<?php

declare(strict_types=1);

namespace App\Support\CallStages;

use App\Models\Agents\AgentStackRow;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Stack\HookAnswer;
use App\Values\StackTarget;
use Closure;

/**
 * One hook call as it enters the answer pipeline: the input, what the driver can take, the adapter's way to render
 * the reply, and whose call it is.
 */
final readonly class HookCallStage
{
    /**
     * @param  Closure(HookAnswer): DriverReply  $render  the driver adapter's reply to the final answer
     */
    public function __construct(
        public HookInput $input,
        public DriverCapabilities $capabilities,
        public Closure $render,
        public HookIdentity $identity,
        public StackTarget $target,
    ) {}

    public function locked(AgentStackRow $row): LockedCall
    {
        return new LockedCall($this, $row);
    }
}
