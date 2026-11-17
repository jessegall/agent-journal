<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use Closure;

/**
 * A native call for a tool that only reads, such as reading a file: the journal has no state that judges it, so the
 * program gets the neutral reply and its own permission handling decides.
 */
final readonly class UntouchedCall implements NativeCall
{
    public function __construct(private ProgramReply $reply) {}

    public function replyWith(Closure $answerByJournal): ProgramReply
    {
        return $this->reply;
    }
}
