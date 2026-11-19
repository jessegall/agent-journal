<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Agents\Contracts\ProgramConversationResolver;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ConversationVisit;
use App\Agents\Models\ProgramConversation;
use App\Agents\Support\ProgramConversationSummary;
use App\Programs\Enums\HookProgram;

/**
 * Reads an agent's native conversations with the model and time of each one's last visit, in two bounded reads.
 */
final readonly class ProgramConversationRecords implements ProgramConversationResolver
{
    public function conversations(string $agentId, HookProgram $program, string|null $contextReference): array
    {
        $conversations = ProgramConversation::query()->ownedBy($agentId)->where('program', $program->value)->where('context_reference', $contextReference)
            ->readLimit(self::MOST_CONVERSATIONS)->get()->keyBy('id');
        $lastVisits = ConversationVisit::query()->whereIn('conversation_id', $conversations->keys()->all())->orderByDesc('observed_at')
            ->readAll('the visits of at most 20 conversations, to find each one\'s last')->get()->unique('conversation_id');
        $models = AgentSession::query()->whereIn('id', $lastVisits->pluck('session_id')->all())->readAll('the sessions of those last visits')->pluck('model', 'id');

        return array_values($lastVisits->map(fn (ConversationVisit $visit) => new ProgramConversationSummary(
            $visit->conversation_id,
            $conversations[$visit->conversation_id]->native_id,
            $conversations[$visit->conversation_id]->context_reference,
            (string) $models[$visit->session_id],
            $visit->observed_at,
        ))->all());
    }
}
