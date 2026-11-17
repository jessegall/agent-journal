<?php

declare(strict_types=1);

namespace App\Core\Hooks\Contracts;

use App\Core\Hooks\Programs\ProgramReply;
use App\Core\Hooks\Stack\HookAnswer;
use Closure;

/**
 * One native hook call after the adapter read it: either a call the journal answers, or one it lets through untouched.
 */
interface NativeCall
{
    /**
     * @param  Closure(HookInput, Closure(HookAnswer): ProgramReply): ProgramReply  $answerByJournal
     */
    public function replyWith(Closure $answerByJournal): ProgramReply;
}
