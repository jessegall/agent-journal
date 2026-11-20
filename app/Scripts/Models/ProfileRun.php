<?php

declare(strict_types=1);

namespace App\Scripts\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkReference;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Scripts\Enums\ProfileRunState;
use App\Scripts\Exceptions\ProfileRunRefused;
use App\Scripts\Values\StepOutcome;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * One run of a profile's activated script for an actor's work, started by one trigger: the revision and digest it
 * runs, where its cursor stands, and the step it waits on while suspended.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $work
 * @property string $profile_key
 * @property int $profile_revision
 * @property string $definition_digest
 * @property string $trigger_reference
 * @property ProfileRunState $state
 * @property int $cursor
 * @property string|null $awaited_step
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('profile_runs')]
#[Fillable([
    'work',
    'profile_key',
    'profile_revision',
    'definition_digest',
    'trigger_reference',
    'state',
    'cursor',
    'awaited_step',
])]
final class ProfileRun extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['profile_revision' => 'integer', 'cursor' => 'integer', 'state' => ProfileRunState::class];
    }

    /**
     * Starts the run a trigger asks for once; the same trigger finds the run it started.
     */
    public static function start(
        ActorIdentity $actor,
        WorkReference $work,
        string $profileKey,
        int $profileRevision,
        string $definitionDigest,
        string $triggerReference,
    ): self {
        $run = self::query()->acrossActors()->ownedBy($actor)->where('trigger_reference', $triggerReference)->first();

        if ($run !== null) {
            return $run;
        }

        $run = new self();
        $run->work = $work->key;
        $run->profile_key = $profileKey;
        $run->profile_revision = $profileRevision;
        $run->definition_digest = $definitionDigest;
        $run->trigger_reference = $triggerReference;
        $run->state = ProfileRunState::Running;
        $run->belongTo($actor);
        $run->save();

        return $run;
    }

    public static function lockedForStep(string $runId): self
    {
        return self::query()->acrossActors()->whereKey($runId)->lockForUpdate()->firstOrFail();
    }

    /**
     * Suspends the run on the step whose outcome the host still owes.
     */
    public function suspendOn(string $stepReference): void
    {
        $this->state = ProfileRunState::Suspended;
        $this->awaited_step = $stepReference;
        $this->save();
    }

    /**
     * Records the host's outcome of the step the run waits on, once, and resumes the same instruction; a step it
     * does not wait on is refused, and the outcome of a step already recorded is kept as it was.
     *
     * @throws ProfileRunRefused
     */
    public function recordStep(string $stepReference, StepOutcome $outcome): ProfileStepResult
    {
        $recorded = $this->results()->where('step_reference', $stepReference)->first();

        if ($recorded !== null) {
            return $recorded;
        }

        if ($this->state !== ProfileRunState::Suspended || $this->awaited_step !== $stepReference) {
            throw ProfileRunRefused::stepNotAwaited($this->id, $stepReference);
        }

        $result = ProfileStepResult::record($this, $stepReference, $outcome);
        $this->state = ProfileRunState::Running;
        $this->awaited_step = null;
        $this->save();

        return $result;
    }

    /**
     * @return HasMany<ProfileStepResult, $this>
     */
    public function results(): HasMany
    {
        return $this->hasMany(ProfileStepResult::class);
    }
}
