<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\HasActorColumns;
use App\Support\ActorIdentity;
use App\Values\CommitObservation;
use App\Values\WorkReference;
use App\Values\WorkspaceFacts;
use App\Values\WorkspaceReadReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * One retained read of an actor's checkout, keyed by the reference of the run, instruction or evaluation that asked:
 * it waits for its host, which samples the checkout once and answers it. A later read of the same reference reuses
 * that one answer; a new reference samples fresh facts.
 *
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
 * @property int $observation_version
 * @property string $binding_id
 * @property string $checkout_id
 * @property string $head_oid
 * @property string $unavailable_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('workspace_reads')]
#[Fillable([
    'read_reference',
    'actor_type',
    'actor_id',
    'work',
    'available',
    'dirty',
    'clean',
    'generation',
    'sampled_at',
])]
final class WorkspaceRead extends Model implements ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Constructors ]----------

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

    // ----------[ Queries ]----------

    /**
     * Retains the read for its reference once; asking again finds the same read.
     */
    public static function retain(WorkspaceReadReference $reference, ActorIdentity $actor, WorkReference $work): self
    {
        $read = new self(['read_reference' => $reference->key, ...$actor->asColumns('actor'), 'work' => $work->key]);
        $read->setAttribute($read->getKeyName(), $read->newUniqueId());
        $read->insertIfAbsent();

        return self::query()->where('read_reference', $reference->key)->sole();
    }

    /**
     * The reads waiting for the host the actors' runtimes run on, oldest first.
     *
     * @return list<self>
     */
    public static function pendingOn(string $hostId, int $limit): array
    {
        $agentsOnHost = AgentSession::query()
            ->whereIn('id', AgentRuntime::query()->where('host_id', $hostId)->select('agent_session_id'))
            ->select('agent_id');

        $pending = self::query()
            ->whereNull('sampled_at')
            ->where('actor_type', 'agent')
            ->whereIn('actor_id', $agentsOnHost)
            ->orderBy('created_at')
            ->readExactly($limit)
            ->get();

        return array_values($pending->all());
    }

    /**
     * The newest sample of the agent's workspace that names a verified commit, none or one: what a child of that agent
     * starts from.
     *
     * @return list<WorkspaceFacts>
     */
    public static function latestCommitReadOf(string $agentId): array
    {
        $read = self::query()->where('actor_type', 'agent')->where('actor_id', $agentId)
            ->where('observation_version', 2)->where('head_oid', '!=', '')->whereNotNull('sampled_at')
            ->latest('sampled_at')->limit(1)->get();

        $facts = [];

        foreach ($read as $row) {
            foreach ($row->facts() as $sample) {
                $facts[] = $sample;
            }
        }

        return $facts;
    }

    public static function byReference(WorkspaceReadReference $reference): self
    {
        return self::query()->where('read_reference', $reference->key)->firstOrFail();
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
        $this->observation_version = $facts->commit->version;
        $this->binding_id = $facts->commit->bindingId;
        $this->checkout_id = $facts->commit->checkoutId;
        $this->head_oid = $facts->commit->headOid;
        $this->unavailable_reason = $facts->commit->reason;
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * What the host found, once it answered.
     *
     * @return Option<WorkspaceFacts>
     */
    public function facts(): Option
    {
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
    }

    private function commitObservation(): CommitObservation
    {
        if ($this->observation_version !== 2) {
            return CommitObservation::notRecorded();
        }

        if ($this->head_oid === '') {
            return CommitObservation::withoutCommit($this->binding_id, $this->checkout_id, $this->unavailable_reason);
        }

        return CommitObservation::ofHead($this->binding_id, $this->checkout_id, $this->head_oid);
    }

    public function reference(): WorkspaceReadReference
    {
        return new WorkspaceReadReference($this->read_reference);
    }
}
