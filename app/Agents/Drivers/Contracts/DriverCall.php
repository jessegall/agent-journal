<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Actors\Contracts\AgentTexts;
use App\Agents\Drivers\Hooks\DriverReply;
use App\Stacks\HookAnswer;
use App\Support\Inputs\Contracts\HookInput;
use Closure;

/**
 * One native hook call after the adapter read it: either a call the journal answers, or one it lets through untouched.
 */
interface DriverCall
{
    /**
     * @param  Closure(HookInput, Closure(HookAnswer, AgentTexts): DriverReply): DriverReply  $answerByJournal
     */
    public function replyWith(Closure $answerByJournal): DriverReply;
}
