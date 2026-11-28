<?php

declare(strict_types=1);

namespace App\Models\Skills;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Skills\SkillRead;
use App\Events\Skills\SkillReadForgotten;
use App\Models\Agents\AgentSession;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Skills\Enums\ReadEvidence;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/**
 * One proven read of a whole skill by a session's agent: every read is a row, so a second read after a compaction is a
 * second row. The rows only record what the operator may look at; nothing else reads them.
 *
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property string $skill_key
 * @property ReadEvidence $evidence
 * @property CarbonImmutable $read_at
 *
 * @mixin \Eloquent
 */
final class SkillReadEntry extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    public const string CREATED_AT = 'read_at';

    public const null UPDATED_AT = null;

    private const int FORGET_BATCH = 100;

    protected $table = 'skill_reads';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'evidence' => ReadEvidence::class,
            'read_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Records that the session's agent read the whole skill, with the evidence that proved it.
     */
    public static function create(AgentSession $session, string $skillKey, ReadEvidence $evidence): self
    {
        $entry = new self();
        $entry->agent_id = $session->agent_id;
        $entry->session_id = $session->id;
        $entry->skill_key = $skillKey;
        $entry->evidence = $evidence;
        $entry->saveAndAssert();
        $entry->raise(new SkillRead($session->id, $skillKey, $evidence));

        return $entry;
    }

    // ----------[ Mutations ]----------

    /**
     * Forgets this read.
     */
    public function forget(): void
    {
        $this->delete();
        $this->raise(new SkillReadForgotten($this->session_id, $this->skill_key));
    }

    // ----------[ Queries ]----------

    /**
     * The next batch of the agent's reads, oldest first; none once every read was forgotten.
     *
     * @return Collection<int, self>
     */
    public static function findBatchOfAgent(string $agentId): Collection
    {
        return self::query()->ofAgent($agentId)->limit(self::FORGET_BATCH)->get();
    }

    /**
     * The session's newest reads, newest first.
     *
     * @return list<self>
     */
    public static function findLatestOfSession(string $sessionId, int $limit): array
    {
        $entries = self::query()->ofSession($sessionId)->newestFirst()->limit($limit)->get();

        return array_values($entries->all());
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgent(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSession(Builder $query, string $sessionId): void
    {
        $query->where('session_id', $sessionId);
    }
}
