<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Casts\StoredValuesCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Processes\EvidencePermitConsumed;
use App\Events\Processes\EvidencePermitExpired;
use App\Exceptions\EvidencePermitRefused;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Values\CommandRule;
use App\Values\PermitLimits;
use App\Values\PermittedLine;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A project owner's one-use permission to run one exact command line as an evidence-only sample: the line and its digests, the effects approved, the actor who may run it, capture limits and
 * expiry. It is used once; the same request id returns the run it already started.
 *
 * @property string $id
 * @property string $project_key
 * @property string $working_folder
 * @property string $source_line
 * @property string $source_digest
 * @property string $classification_digest
 * @property list<string> $approved_classes
 * @property string $runner_type
 * @property string $runner_id
 * @property int $byte_cap
 * @property int $seconds_cap
 * @property CarbonImmutable $expires_at
 * @property string|null $request_id
 * @property CarbonImmutable|null $consumed_at
 * @property string|null $process_run_id
 * @property string|null $command_request_id
 * @property list<CommandRule> $candidate_rules the proposed rules the line is classified with, for a request's sample
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'project_key',
    'working_folder',
    'source_line',
    'source_digest',
    'classification_digest',
    'approved_classes',
    'runner_type',
    'runner_id',
    'byte_cap',
    'seconds_cap',
    'expires_at',
    'command_request_id',
    'candidate_rules',
])]
final class EvidencePermit extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'approved_classes' => 'array',
            'byte_cap' => 'integer',
            'seconds_cap' => 'integer',
            'expires_at' => 'immutable_datetime',
            'consumed_at' => 'immutable_datetime',
            'candidate_rules' => StoredValuesCast::class.':'.CommandRule::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The permit to run one exact line once under the runner's actor, within the limits: the owner's own, or, for a
     * request, the permit for one sample of its line, classified with the declarations the owner approved for it.
     *
     * @param  list<CommandRule>  $candidateRules
     */
    public static function create(
        string $projectKey,
        PermittedLine $line,
        ActorIdentity $runner,
        PermitLimits $limits,
        CommandRequest|null $request,
        array $candidateRules,
    ): self {
        $permit = self::filled($projectKey, $line, $runner, $limits);
        $permit->command_request_id = $request?->id;
        $permit->candidate_rules = $candidateRules;
        $permit->save();

        return $permit;
    }

    // ----------[ Mutations ]----------

    /**
     * Uses the permit for its run; a failed spawn or capture later still leaves it used.
     */
    public function consume(string $requestId, ProcessRun $run): void
    {
        $this->request_id = $requestId;
        $this->consumed_at = CarbonImmutable::now();
        $this->process_run_id = $run->id;
        $this->assertSaved($this->save());
        $this->raise(new EvidencePermitConsumed($this->id, $run->id));
    }

    public function expire(): void
    {
        $this->expires_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $this->raise(new EvidencePermitExpired($this->id));
    }

    // ----------[ Getters ]----------

    public function wasStartedBy(string $requestId): bool
    {
        return $this->consumed_at !== null && $this->request_id === $requestId;
    }

    // ----------[ Asserts ]----------

    /**
     * Checks that this actor may use the permit now for this request; the same request id again is allowed and the
     * caller returns the run it already started.
     *
     * @throws EvidencePermitRefused
     */
    public function assertUsable(ActorIdentity $runner, string $requestId, string $classificationDigest): void
    {
        if ($this->runner_type !== $runner->type->value || $this->runner_id !== $runner->id) {
            throw EvidencePermitRefused::otherActor();
        }

        if ($this->consumed_at !== null && $this->request_id !== $requestId) {
            throw EvidencePermitRefused::consumed();
        }

        if ($this->consumed_at === null && $this->expires_at->isPast()) {
            throw EvidencePermitRefused::expired();
        }

        if ($this->classification_digest !== $classificationDigest) {
            throw EvidencePermitRefused::changed();
        }
    }

    // ----------[ Internals ]----------

    /**
     * A permit for the line, filled from the line, the runner and the limits, not yet saved.
     */
    private static function filled(
        string $projectKey,
        PermittedLine $line,
        ActorIdentity $runner,
        PermitLimits $limits,
    ): self {
        $permit = new self();
        $permit->project_key = $projectKey;
        $permit->working_folder = $line->workingFolder;
        $permit->source_line = $line->line;
        $permit->source_digest = hash('sha256', $line->line);
        $permit->classification_digest = $line->classificationDigest;
        $permit->approved_classes = $line->approvedClasses;
        $permit->runner_type = $runner->type->value;
        $permit->runner_id = $runner->id;
        $permit->byte_cap = $limits->byteCap;
        $permit->seconds_cap = $limits->secondsCap;
        $permit->expires_at = CarbonImmutable::now()->addMinutes($limits->minutesValid);

        return $permit;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function sampling(Builder $query, CommandRequest $request): void
    {
        $query->where('command_request_id', $request->id)->whereNotNull('process_run_id');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey);
    }
}
