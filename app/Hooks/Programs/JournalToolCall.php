<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Contracts\ProgramCall;
use Closure;

/**
 * A native call to the journal's own MCP server, its tool search or its resources. The bus guard judges the journal
 * call itself, so the hook neither walks the stack again nor adds reminders or transitions: it lets the call through.
 */
final readonly class JournalToolCall implements ProgramCall
{
    private function __construct(private ProgramReply $reply) {}

    /**
     * Before the call: the neutral reply, so the program's own permission handling decides.
     */
    public static function starting(): self
    {
        return new self(ProgramReplies::allowTool([]));
    }

    /**
     * After the call: the empty reply of a hook that only reports.
     */
    public static function finished(): self
    {
        return new self(ProgramReply::emptyObject());
    }

    public function replyWith(Closure $answerByJournal): ProgramReply
    {
        return $this->reply;
    }
}
