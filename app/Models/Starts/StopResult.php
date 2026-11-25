<?php

declare(strict_types=1);

namespace App\Models\Starts;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\Starts\StopResultType;
use App\Values\StopResultLine;
use App\Values\StopResultReport;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $stop_attempt_id
 * @property string $condition_key
 * @property string $definition_hash
 * @property StopResultType $status
 * @property CarbonImmutable $started_at
 * @property ?CarbonImmutable $ended_at
 * @property ?int $exit_code
 * @property ?string $signal
 * @property string $summary
 * @property ?string $output
 * @property bool $truncated
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property StopAttempt $attempt
 */
final class StopResult extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsRowSets;
    use Linkable;

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

    // ----------[ Constructors ]----------

    /**
     * Writes the attempt's result of each report in one insert.
     *
     * @param  list<StopResultReport>  $reports
     * @return list<string> the ids of the rows written
     */
    public static function createMany(StopAttempt $attempt, array $reports): array
    {
        $results = [];

        foreach ($reports as $report) {
            $result = new self();
            $result->stop_attempt_id = $attempt->id;
            $result->condition_key = $report->conditionKey;
            $result->definition_hash = $report->definitionHash;
            $result->status = $report->status;
            $result->started_at = CarbonImmutable::parse($report->startedAt);
            $result->ended_at = $report->endedAt === null ? null : CarbonImmutable::parse($report->endedAt);
            $result->exit_code = $report->exitCode;
            $result->signal = $report->signal;
            $result->summary = $report->summary;
            $result->output = $report->output;
            $result->truncated = $report->isTruncated;
            $results[] = $result;
        }

        return self::insertRows($results);
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<StopAttempt, $this>
     */
    public function attempt(): BelongsTo
    {
        return $this->belongsTo(StopAttempt::class, 'stop_attempt_id');
    }

    // ----------[ Queries ]----------

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

    /**
     * The results that still keep their raw output.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withOutput(Builder $query): void
    {
        $query->whereNotNull('output');
    }

    /**
     * The results recorded before the moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function createdBefore(Builder $query, CarbonImmutable $moment): void
    {
        $query->where('created_at', '<', $moment);
    }
}
