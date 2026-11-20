<?php

declare(strict_types=1);

namespace App\Hooks\Models;

use App\Hooks\Enums\StopResultType;
use App\Hooks\Values\StopResultLine;
use App\Hooks\Values\StopResultReport;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * How one condition of a stop attempt ended on the host, with a short summary that stays and the raw output, which
 * is kept for a week. It holds no secret.
 *
 * @property string $id
 * @property string $stop_attempt_id
 * @property string $condition_key
 * @property string $definition_hash
 * @property StopResultType $status
 * @property CarbonImmutable $started_at
 * @property CarbonImmutable|null $ended_at
 * @property int|null $exit_code
 * @property string|null $signal
 * @property string $summary
 * @property string|null $output
 * @property bool $truncated
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'condition_key',
    'definition_hash',
    'status',
    'started_at',
    'ended_at',
    'exit_code',
    'signal',
    'summary',
    'output',
    'truncated',
])]
final class StopResult extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => StopResultType::class,
            'started_at' => 'immutable_datetime',
            'ended_at' => 'immutable_datetime',
            'exit_code' => 'integer',
            'truncated' => 'boolean',
        ];
    }

    public static function create(StopAttempt $attempt, StopResultReport $report): self
    {
        $stopRecord = new self();
        $stopRecord->stop_attempt_id = $attempt->id;
        $stopRecord->condition_key = $report->conditionKey;
        $stopRecord->definition_hash = $report->definitionHash;
        $stopRecord->status = $report->status;
        $stopRecord->started_at = CarbonImmutable::parse($report->startedAt);
        $stopRecord->ended_at = $report->endedAt === null ? null : CarbonImmutable::parse($report->endedAt);
        $stopRecord->exit_code = $report->exitCode;
        $stopRecord->signal = $report->signal;
        $stopRecord->summary = $report->summary;
        $stopRecord->output = $report->output;
        $stopRecord->truncated = $report->truncated;
        $stopRecord->save();

        return $stopRecord;
    }

    // ----------[ Queries ]----------

    /**
     * Forgets the raw output of every result recorded before the moment, and answers how many there were; their
     * summaries stay.
     */
    public static function forgetOutputBefore(CarbonImmutable $before): int
    {
        return self::query()->whereNotNull('output')->where('created_at', '<', $before)->update(['output' => null]);
    }

    // ----------[ Answers ]----------

    /**
     * This result as an inspection shows it, under its condition's label; its raw output stays out.
     */
    public function line(string $label): StopResultLine
    {
        $duration = $this->ended_at === null
            ? null
            : (int) $this->started_at->diffInMilliseconds($this->ended_at);

        return new StopResultLine(
            $label,
            $this->status,
            $duration,
            $this->exit_code,
            $this->signal,
            $this->truncated,
            $this->summary,
        );
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<StopAttempt, $this>
     */
    public function attempt(): BelongsTo
    {
        return $this->belongsTo(StopAttempt::class, 'stop_attempt_id');
    }
}
