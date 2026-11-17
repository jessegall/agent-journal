<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use App\Domain\Hooks\Inputs\HookInput;
use App\Domain\Hooks\Stack\HookAnswer;
use Closure;

/**
 * A native call the journal answers: the input for the walk, and how the program's reply is rendered from the answer.
 */
final readonly class JournalCall implements NativeCall
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
