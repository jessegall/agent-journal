<?php

declare(strict_types=1);

namespace App\Communication\Enums;

use App\Communication\Models\Message;
use Illuminate\Database\Eloquent\Builder;

enum AgentInboxState: string
{
    case Pending = 'pending';
    case Answered = 'answered';
    case All = 'all';

    /**
     * @param Builder<Message> $incoming
     * @return Builder<Message>
     */
    public function apply(Builder $incoming): Builder
    {
        return match ($this) {
            self::Pending => $incoming->where(fn (Builder $pending) => $pending
                ->where('state', MessageState::WaitingForAnswer)
                ->orWhere(fn (Builder $unread) => $unread->whereNull('read_at')->where('state', MessageState::Sent))),
            self::Answered => $incoming->where('state', MessageState::Answered),
            self::All => $incoming,
        };
    }
}
