<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\CaptureState;
use App\Enums\LifecycleState;
use App\Enums\OutputStream;
use App\Enums\PartEndType;
use App\Events\Processes\PartRunCaptured;
use App\Events\Processes\PartRunCaptureMarked;
use App\Events\Processes\PartRunDrained;
use App\Events\Processes\PartRunLost;
use App\Events\Processes\PartRunProcessFinished;
use App\Events\Processes\PartRunSkipped;
use App\Events\Processes\PartRunSpawnFailed;
use App\Events\Processes\PartRunStarted;
use App\Events\Processes\PartRunStopped;
use App\Exceptions\PartTransitionRefused;
use App\Values\PartEnd;
use App\Values\PartKey;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * One attempt of one executable part of a run: its syntax node, part and
 * attempt, the operation it runs, its lifecycle, its process end and how far its output was kept. It ends only once
 * its process ended and its streams are drained.
 *
 * @property string $id
 * @property string $process_run_id
 * @property int $syntax_node
 * @property string $part_id
 * @property int $attempt
 * @property string|null $parent_part_run_id
 * @property string $operation
 * @property LifecycleState $lifecycle
 * @property CarbonImmutable|null $started_at
 * @property CarbonImmutable|null $ended_at
 * @property int|null $pid
 * @property string|null $host
 * @property PartEndType $end_type
 * @property int $end_code
 * @property string $end_reason
 * @property bool $streams_drained
 * @property string $skip_reason
 * @property string $stop_reason
 * @property CaptureState $capture_state
 * @property array<string, int> $stream_offsets
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['process_run_id', 'syntax_node', 'part_id', 'attempt', 'parent_part_run_id', 'operation'])]
final class PartRun extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'lifecycle' => 'queued',
        'end_type' => 'not_yet',
        'capture_state' => 'recording',
        'stream_offsets' => '{}',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'syntax_node' => 'integer',
            'attempt' => 'integer',
            'lifecycle' => LifecycleState::class,
            'started_at' => 'immutable_datetime',
            'ended_at' => 'immutable_datetime',
            'pid' => 'integer',
            'end_type' => PartEndType::class,
            'end_code' => 'integer',
            'streams_drained' => 'boolean',
            'capture_state' => CaptureState::class,
            'stream_offsets' => 'array',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The run of one part of a process run, queued and not yet started.
     */
    public static function create(ProcessRun $run, PartKey $part): self
    {
        return self::query()->create([
            'process_run_id' => $run->id,
            'syntax_node' => $part->node,
            'part_id' => $part->partId(),
            'attempt' => $part->attempt,
            'operation' => $part->operation,
        ]);
    }

    // ----------[ Mutations ]----------

    /**
     * Starts the part on a host, in its own process, or with no process for a builtin that runs inside the
     * supervisor.
     */
    public function start(string $host, int|null $pid = null): void
    {
        $this->moveTo(LifecycleState::Running);
        $this->pid = $pid;
        $this->host = $host;
        $this->started_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $this->raise(new PartRunStarted($this->id, $host));
    }

    /**
     * Records the process end; the part drains its streams before it ends.
     */
    public function finishProcess(PartEnd $end): void
    {
        $this->moveTo(LifecycleState::Draining);
        $this->end_type = $end->type;
        $this->end_code = $end->code;
        $this->end_reason = $end->reason;
        $this->assertSaved($this->save());
        $this->raise(new PartRunProcessFinished($this->id));
    }

    /**
     * Records that every stream was read to its end, and ends the part.
     */
    public function finishDraining(): void
    {
        if (! $this->end->hasEnded()) {
            throw PartTransitionRefused::notDrained();
        }

        $this->moveTo(LifecycleState::Ended);
        $this->streams_drained = true;
        $this->ended_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $this->raise(new PartRunDrained($this->id));
    }

    /**
     * Records how far a stream was captured, as the byte offset after its last chunk.
     */
    public function captureUpTo(OutputChunk $chunk): void
    {
        $this->stream_offsets = [...$this->stream_offsets, $chunk->stream->value => $chunk->offset + $chunk->length];
        $this->assertSaved($this->save());
        $this->raise(new PartRunCaptured($this->id));
    }

    public function markCapture(CaptureState $state): void
    {
        $this->capture_state = $state;
        $this->assertSaved($this->save());
        $this->raise(new PartRunCaptureMarked($this->id, $state));
    }

    /**
     * Stops the part on a stop request; its partial output stays as diagnostics.
     */
    public function stop(string $reason): void
    {
        $this->stop_reason = $reason;
        $this->capture_state = CaptureState::Incomplete;
        $this->finishAs(LifecycleState::Stopped);
        $this->raise(new PartRunStopped($this->id, $reason));
    }

    /**
     * The supervisor went silent past its replay window: the part ends without a status, its capture incomplete and
     * its bytes kept. Silence is never a success.
     */
    public function lose(): void
    {
        $this->end_type = PartEndType::Unavailable;
        $this->end_code = 0;
        $this->end_reason = 'exit_unavailable: the supervisor stopped reporting';
        $this->capture_state = CaptureState::Incomplete;
        $this->finishAs(LifecycleState::Lost);
        $this->raise(new PartRunLost($this->id));
    }

    public function failToSpawn(string $reason): void
    {
        $this->end_type = PartEndType::Unavailable;
        $this->end_reason = $reason;
        $this->finishAs(LifecycleState::SpawnFailed);
        $this->raise(new PartRunSpawnFailed($this->id, $reason));
    }

    /**
     * Skips a part its controlling result decided against, such as the right side of a failed &&.
     */
    public function skip(string $controllingResult): void
    {
        $this->skip_reason = $controllingResult;
        $this->finishAs(LifecycleState::Skipped);
        $this->raise(new PartRunSkipped($this->id));
    }

    /**
     * The digest of each stream's chunk manifest: its chunk checksums in offset order.
     *
     * @return array<string, string>
     */
    public function manifestDigests(): array
    {
        $checksums = [];

        foreach ($this->chunks()->orderBy('stream')->orderBy('offset')->readLimit(100_000)->get() as $chunk) {
            $checksums[$chunk->stream->value][] = $chunk->checksum;
        }

        return array_map(fn (array $sums): string => hash('sha256', implode("\n", $sums)), $checksums);
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<PartEnd, never>
     */
    protected function end(): Attribute
    {
        return Attribute::get(fn () => match ($this->end_type) {
            PartEndType::NotYet => PartEnd::notYet(),
            PartEndType::Exited => PartEnd::exited($this->end_code),
            PartEndType::Signalled => PartEnd::signalled($this->end_code),
            PartEndType::Unavailable => PartEnd::unavailable($this->end_reason),
        })->withoutObjectCaching();
    }

    /**
     * The streams this part wrote at least one byte to.
     *
     * @return Attribute<list<OutputStream>, never>
     */
    protected function recordedStreams(): Attribute
    {
        return Attribute::get(function () {
            $written = array_keys(array_filter($this->stream_offsets, fn (int $end) => $end > 0));

            return array_map(fn (string $stream) => OutputStream::from($stream), $written);
        });
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<ProcessRun, $this>
     */
    public function run(): BelongsTo
    {
        return $this->belongsTo(ProcessRun::class, 'process_run_id');
    }

    /**
     * @return HasMany<OutputAssessment, $this>
     */
    public function assessments(): HasMany
    {
        return $this->hasMany(OutputAssessment::class);
    }

    /**
     * @return HasMany<OutputChunk, $this>
     */
    public function chunks(): HasMany
    {
        return $this->hasMany(OutputChunk::class);
    }

    // ----------[ Internals ]----------

    private function finishAs(LifecycleState $state): void
    {
        $this->moveTo($state);
        $this->ended_at = CarbonImmutable::now();
        $this->save();
    }

    private function moveTo(LifecycleState $next): void
    {
        if (! $this->lifecycle->canMoveTo($next)) {
            throw PartTransitionRefused::between($this->lifecycle, $next);
        }

        $this->lifecycle = $next;
    }

    // ----------[ Scopes ]----------

    /**
     * The ended parts of a run that no reader assessed yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function endedUnassessedOf(Builder $query, ProcessRun $run): void
    {
        $query->where('process_run_id', $run->id)
            ->where('lifecycle', LifecycleState::Ended->value)
            ->whereDoesntHave('assessments');
    }
}
