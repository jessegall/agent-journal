<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Connections\WorkspaceReadAnswered;
use App\Models\Agents\AgentSession;
use App\Models\Support\Accessor;
use App\Models\Support\HasActorColumns;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Values\CommitObservation;
use App\Values\WorkReference;
use App\Values\WorkspaceFacts;
use App\Values\WorkspaceReadReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use PhpOption\None;
use PhpOption\Some;

/**
 * @property string $id
 * @property string $read_reference
 * @property string $actor_type
 * @property string $actor_id
 * @property string $work
 * @property bool|null $available
 * @property bool|null $dirty
 * @property bool|null $clean
 * @property int|null $generation
 * @property CarbonImmutable|null $sampled_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property string $binding_id
 * @property string $checkout_id
 * @property string $head_oid
 * @property string $unavailable_reason
 * @property-read mixed $facts
 * @property-read mixed $reference
 *
 * @mixin \Eloquent
 */
#[Table('workspace_reads')]
final class WorkspaceRead extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'available' => 'boolean',
            'dirty' => 'boolean',
            'clean' => 'boolean',
            'generation' => 'integer',
            'sampled_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Retains the read for its reference once; asking again finds the same read.
     */
    public static function create(WorkspaceReadReference $reference, ActorReference $actor, WorkReference $work): self
    {
        $read = new self();
        $read->read_reference = $reference->key;
        $read->actor_type = $actor->type;
        $read->actor_id = $actor->id;
        $read->work = $work->key;
        $read->setAttribute($read->getKeyName(), $read->newUniqueId());
        $read->insertIfAbsent();

        return self::findUnderReference($reference);
    }

    // ----------[ Mutations ]----------

    /**
     * Records the host's one sample; an answer for a read already answered changes nothing.
     */
    public function answer(WorkspaceFacts $facts): void
    {
        if ($this->sampled_at !== null) {
            return;
        }

        $this->available = $facts->isAvailable;
        $this->dirty = $facts->isDirty;
        $this->clean = $facts->isClean;
        $this->generation = $facts->generation;
        $this->sampled_at = $facts->sampledAt;
        $this->binding_id = $facts->commit->bindingId;
        $this->checkout_id = $facts->commit->checkoutId;
        $this->head_oid = $facts->commit->headOid;
        $this->unavailable_reason = $facts->commit->reason;
        $this->saveAndAssert();
        $this->raise(new WorkspaceReadAnswered($this->id));
    }

    private function commitObservation(): CommitObservation
    {
        if ($this->binding_id === '') {
            return CommitObservation::notRecorded();
        }

        if ($this->head_oid === '') {
            return CommitObservation::withoutCommit($this->binding_id, $this->checkout_id, $this->unavailable_reason);
        }

        return CommitObservation::ofHead($this->binding_id, $this->checkout_id, $this->head_oid);
    }

    // ----------[ Accessors ]----------

    /**
     * What the host found, once it answered.
     *
     * @return Attribute<None|Some<WorkspaceFacts>, never>
     */
    protected function facts(): Attribute
    {
        return Accessor::get(function () {
            if ($this->sampled_at === null) {
                return None::create();
            }

            return new Some(new WorkspaceFacts(
                (bool) $this->available,
                (bool) $this->dirty,
                (bool) $this->clean,
                (int) $this->generation,
                $this->sampled_at,
                $this->commitObservation(),
            ));
        });
    }

    /**
     * @return Attribute<WorkspaceReadReference, never>
     */
    protected function reference(): Attribute
    {
        return Accessor::get(fn () => new WorkspaceReadReference($this->read_reference));
    }

    // ----------[ Queries ]----------

    /**
     * The reads waiting for the host the actors' runtimes run on, oldest first.
     *
     * @return list<self>
     */
    public static function findPendingOn(string $hostId, int $limit): array
    {
        $pending = self::query()
            ->unsampled()
            ->byAgentsOnHost($hostId)
            ->oldestFirst()
            ->limit($limit)
            ->get();

        return array_values($pending->all());
    }

    /**
     * The newest sample of the agent's workspace that names a verified commit, none or one: what a child of that agent
     * starts from.
     *
     * @return list<WorkspaceFacts>
     */
    public static function resolveLatestCommitReadOf(string $agentId): array
    {
        $read = self::query()->byAgent($agentId)->sampledAtCommit()->lastSampledFirst()->limit(1)->get();

        $facts = [];

        foreach ($read as $row) {
            foreach ($row->facts as $sample) {
                $facts[] = $sample;
            }
        }

        return $facts;
    }

    public static function findByReference(WorkspaceReadReference $reference): self
    {
        return self::query()->underReference($reference)->firstOrFail();
    }

    /**
     * The workspace read kept under this reference.
     */
    public static function findUnderReference(WorkspaceReadReference $reference): self
    {
        return self::query()->underReference($reference)->sole();
    }

    // ----------[ Scopes ]----------

    /**
     * The read of that reference.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function underReference(Builder $query, WorkspaceReadReference $reference): void
    {
        $query->where('read_reference', $reference->key);
    }

    /**
     * The reads not sampled yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unsampled(Builder $query): void
    {
        $query->whereNull('sampled_at');
    }

    /**
     * The agent's reads.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byAgent(Builder $query, string $agentId): void
    {
        $query->where('actor_type', 'agent')->where('actor_id', $agentId);
    }

    /**
     * The reads of the agents whose sessions run on the host.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byAgentsOnHost(Builder $query, string $hostId): void
    {
        $agents = AgentSession::query()->runningOnHost($hostId)->agentIds();

        $query->where('actor_type', 'agent')->whereIn('actor_id', $agents);
    }

    /**
     * The sampled reads of a binding at a known commit.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function sampledAtCommit(Builder $query): void
    {
        $query->where('binding_id', '!=', '')->where('head_oid', '!=', '')->whereNotNull('sampled_at');
    }

    /**
     * The reads sampled last first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function lastSampledFirst(Builder $query): void
    {
        $query->orderByDesc('sampled_at');
    }

    /**
     * The reads oldest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function oldestFirst(Builder $query): void
    {
        $query->orderBy('created_at');
    }
}
