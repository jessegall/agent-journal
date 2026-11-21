<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use App\Hooks\Drivers\Contracts\DriverCall;
use Closure;

/**
 * A native call to the journal's own MCP server, its tool search or its resources. The bus guard judges the journal
 * call itself, so the hook neither walks the stack again nor adds reminders or transitions: it lets the call through.
 */
final readonly class JournalToolCall implements DriverCall
{
    private function __construct(private DriverReply $reply) {}

    /**
     * Before the call: the neutral reply, so the program's own permission handling decides.
     */
    public static function starting(): self
    {
        return new self(DriverReplies::allowTool([]));
    }

    /**
     * After the call: the empty reply of a hook that only reports.
     */
    public static function finished(): self
    {
        return new self(DriverReply::emptyObject());
    }

    public function replyWith(Closure $answerByJournal): DriverReply
    {
        return $this->reply;
    }
}
