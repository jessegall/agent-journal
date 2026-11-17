<?php

declare(strict_types=1);

namespace App\Domain\Memory;

use App\Domain\Memory\Models\Memory;
use Carbon\CarbonImmutable;
use Illuminate\Database\ConnectionInterface;

/**
 * The named operations on an agent's memories: fading them once per compaction, and the reminders they give.
 */
final readonly class AgentMemories
{
    public function __construct(private ConnectionInterface $database) {}

    /**
     * Lowers every memory of the agent by one for this compaction, once: a repeated compaction id changes nothing.
     */
    public function fadeOnce(int $agentId, int $sessionId, string $compactionId): void
    {
        $now = CarbonImmutable::now();
        $isNew = $this->database->table('memory_compactions')->insertOrIgnore([
            'agent_id' => $agentId,
            'session_id' => $sessionId,
            'compaction_id' => $compactionId,
            'created_at' => $now,
            'updated_at' => $now,
        ]) === 1;

        if (! $isNew) {
            return;
        }

        Memory::query()->where('agent_id', $agentId)->decrement('weight');
        Memory::query()->where('agent_id', $agentId)->where('weight', '<=', 0)->delete();
    }

    /**
     * @return list<string>
     */
    public function remindersFor(int $agentId): array
    {
        $texts = Memory::query()->where('agent_id', $agentId)->orderByDesc('weight')->orderBy('id')->pluck('text')->all();

        return array_values(array_map(fn (string $text) => "Memory: {$text}", $texts));
    }
}
