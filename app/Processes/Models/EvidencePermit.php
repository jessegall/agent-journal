<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Processes\Casts\StoredValuesCast;
use App\Processes\Exceptions\EvidencePermitRefused;
use App\Processes\Values\CommandRule;
use App\Processes\Values\PermitLimits;
use App\Processes\Values\PermittedLine;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A project owner's one-use permission to run one exact command line as an evidence-only sample (doc 21 revision 6,
 * sections 71 and 72): the line and its digests, the effects approved, the actor who may run it, capture limits and
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
final class EvidencePermit extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    // ----------[ Constructors ]----------

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

    /**
     * The owner's permit to run one exact line once under the runner's actor, within the limits.
     */
    public static function issue(
        string $projectKey,
        PermittedLine $line,
        ActorIdentity $runner,
        PermitLimits $limits,
    ): self {
        $permit = self::filled($projectKey, $line, $runner, $limits);
        $permit->candidate_rules = [];
        $permit->save();

        return $permit;
    }

    /**
     * The permit for one sample of a request's line, classified with the declaration the owner approved for sampling.
     */
    public static function forRequest(
        CommandRequest $request,
        PermittedLine $line,
        CommandRule $proposed,
        PermitLimits $limits,
    ): self {
        $permit = self::filled($request->project_key, $line, $request->actor(), $limits);
        $permit->command_request_id = $request->id;
        $permit->candidate_rules = [$proposed];
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
        $this->save();
    }

    public function expire(): void
    {
        $this->expires_at = CarbonImmutable::now();
        $this->save();
    }

    // ----------[ Answers ]----------

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

    public function wasStartedBy(string $requestId): bool
    {
        return $this->consumed_at !== null && $this->request_id === $requestId;
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
