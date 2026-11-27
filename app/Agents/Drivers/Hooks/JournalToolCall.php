<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Hooks;

use App\Agents\Drivers\Contracts\DriverCall;
use App\Agents\Drivers\Enums\ToolAllowance;
use Closure;

/**
 * A native call to the journal's own MCP server, its tool search or its resources. The bus guard judges the journal
 * call itself, so the hook neither walks the stack again nor adds reminders or transitions: it lets the call through.
 */
final readonly class JournalToolCall implements DriverCall
{
    private function __construct(private DriverReply $reply) {}

    /**
     * Before the call: allowed, so the driver asks no user; the bus guard judges what the journal call does.
     */
    public static function starting(ToolAllowance $allowance): self
    {
        return new self(DriverReplies::allowTool([], $allowance));
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
