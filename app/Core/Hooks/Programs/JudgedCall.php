<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Contracts\ProgramCall;
use App\Core\Hooks\Stack\HookAnswer;
use Closure;

/**
 * A native call the journal answers: the input for the walk, and how the program's reply is rendered from the answer.
 */
final readonly class JudgedCall implements ProgramCall
{
    /**
     * @param  Closure(HookAnswer): ProgramReply  $render
     */
    public function __construct(
        public HookInput $input,
        public Closure $render,
    ) {}

    public function replyWith(Closure $answerByJournal): ProgramReply
    {
        return $answerByJournal($this->input, $this->render);
    }
}
