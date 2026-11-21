<?php

declare(strict_types=1);

namespace App\Hooks\Drivers\Contracts;

use App\Hooks\Drivers\DriverReply;
use App\Hooks\Inputs\Contracts\HookInput;
use App\Hooks\Stack\HookAnswer;
use Closure;

/**
 * One native hook call after the adapter read it: either a call the journal answers, or one it lets through untouched.
 */
interface DriverCall
{
    /**
     * @param  Closure(HookInput, Closure(HookAnswer): DriverReply): DriverReply  $answerByJournal
     */
    public function replyWith(Closure $answerByJournal): DriverReply;
}
