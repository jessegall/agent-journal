<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\RunLogicalResult;
use App\Enums\RunResultSource;
use App\Events\Processes\RunOutcomeRecorded;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * The one logical result of one run attempt: what the root plan ended with, where that came from, and a version
 * that rises when a genuine signed result corrects a provisional one in place.
 *
 * @property string $id
 * @property string $run_id
 * @property string $attempt_id
 * @property RunLogicalResult $result
 * @property RunResultSource $source
 * @property int $version
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable $updated_at
 */
#[Table('run_outcomes')]
#[Fillable(['run_id', 'attempt_id', 'result', 'source', 'version'])]
final class RunOutcome extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'result' => RunLogicalResult::class,
            'source' => RunResultSource::class,
            'version' => 'integer',
        ];
    }

    /**
     * The attempt's first result, unless it already has one; only the call that recorded it raises the fact.
     */
    public static function create(
        ProcessRun $run,
        string $attemptId,
        RunLogicalResult $result,
        RunResultSource $source,
    ): self {
        $outcome = new self([
            'run_id' => $run->id,
            'attempt_id' => $attemptId,
            'result' => $result,
            'source' => $source,
            'version' => 1,
        ]);

        $outcome->id = $outcome->newUniqueId();

        if ($outcome->insertIfAbsent()) {
            $outcome->raise(new RunOutcomeRecorded($run->id, $attemptId, $result, false));
        }

        return $outcome;
    }

    // ----------[ Queries ]----------

    /**
     * The result of the run's current attempt, when one was recorded.
     *
     * @return Option<self>
     */
    public static function ofRun(ProcessRun $run): Option
    {
        return Option::fromValue(self::query()->where('attempt_id', $run->attempt_id)->first());
    }

    /**
     * The attempt's result under its row lock, when one was recorded.
     *
     * @return Option<self>
     */
    public static function lockedForAttempt(string $attemptId): Option
    {
        return Option::fromValue(self::query()->where('attempt_id', $attemptId)->lockForUpdate()->first());
    }

    // ----------[ Mutations ]----------

    /**
     * A genuine signed result replaces the provisional one in place, keeping the row and its read state elsewhere.
     */
    public function correct(RunLogicalResult $result, RunResultSource $source): void
    {
        $this->result = $result;
        $this->source = $source;
        $this->version++;
        $this->assertSaved($this->save());
        $this->raise(new RunOutcomeRecorded($this->run_id, $this->attempt_id, $result, true));
    }

    // ----------[ Answers ]----------

    public function isProvisional(): bool
    {
        return ! $this->source->isAuthoritative();
    }

    public function isResult(RunLogicalResult $result): bool
    {
        return $this->result === $result;
    }
}
