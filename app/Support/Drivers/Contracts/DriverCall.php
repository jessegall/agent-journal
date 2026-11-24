<?php

declare(strict_types=1);

namespace App\Support\Drivers\Contracts;

use App\Contracts\Actors\AgentTexts;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Stack\HookAnswer;
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
