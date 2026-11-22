<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Agents\Contracts\DriverConversationResolver;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ConversationVisit;
use App\Agents\Models\DriverConversation;
use App\Agents\Support\DriverConversationSummary;
use App\Drivers\Enums\HookDriver;

/**
 * Reads an agent's native conversations with the model and time of each one's last visit, in two bounded reads.
 */
final readonly class DriverConversationRecords implements DriverConversationResolver
{
    public function conversations(string $agentId, HookDriver $driver, string|null $contextReference): array
    {
        $conversations = DriverConversation::query()->ownedBy($agentId)->where('resume_protocol', $driver->value)->where(
            'context_reference',
            $contextReference,
        )
            ->limit(self::MOST_CONVERSATIONS)->get()->keyBy('id');

        $lastVisits = ConversationVisit::query()->whereIn(
            'conversation_id',
            $conversations->keys()->all(),
        )->orderByDesc('observed_at')
            ->readAll('the visits of at most 20 conversations, to find each one\'s last')
            ->get()
            ->unique('conversation_id');

        $models = AgentSession::query()->whereIn(
            'id',
            $lastVisits->pluck('session_id')->all(),
        )->readAll('the sessions of those last visits')->pluck('model', 'id');

        return array_values($lastVisits->map(fn (ConversationVisit $visit) => new DriverConversationSummary(
            $visit->conversation_id,
            $conversations[$visit->conversation_id]->native_id,
            $conversations[$visit->conversation_id]->context_reference,
            (string) $models[$visit->session_id],
            $visit->observed_at,
        ))->all());
    }
}
