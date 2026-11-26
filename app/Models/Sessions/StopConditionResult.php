<?php

declare(strict_types=1);

namespace App\Models\Sessions;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\Sessions\StopConditionResultType;
use App\Models\Support\JournalModel;
use App\Values\StopConditionResultLine;
use App\Values\StopConditionResultReport;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $stop_check_id
 * @property string $condition_key
 * @property string $definition_hash
 * @property StopConditionResultType $status
 * @property CarbonImmutable $started_at
 * @property CarbonImmutable|null $ended_at
 * @property int|null $exit_code
 * @property string|null $signal
 * @property string $summary
 * @property string|null $output
 * @property bool $truncated
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read StopCheck $attempt
 *
 * @mixin \Eloquent
 */
final class StopConditionResult extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use InsertsRowSets;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => StopConditionResultType::class,
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
     * @param  list<StopConditionResultReport>  $reports
     * @return list<string> the ids of the rows written
     */
    public static function createMany(StopCheck $attempt, array $reports): array
    {
        $results = [];

        foreach ($reports as $report) {
            $result = new self();
            $result->stop_check_id = $attempt->id;
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
     * @return BelongsTo<StopCheck, $this>
     */
    public function attempt(): BelongsTo
    {
        return $this->belongsTo(StopCheck::class, 'stop_check_id');
    }

    // ----------[ Queries ]----------

    /**
     * This result as an inspection shows it, under its condition's label; its raw output stays out.
     */
    public function line(string $label): StopConditionResultLine
    {
        $duration = $this->ended_at === null
            ? null
            : (int) $this->started_at->diffInMilliseconds($this->ended_at);

        return new StopConditionResultLine(
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
