<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Runs\RunLogicalResult;
use App\Enums\Runs\RunResultSource;
use App\Events\Processes\RunOutcomeRecorded;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $run_id
 * @property string $attempt_id
 * @property RunLogicalResult $result
 * @property RunResultSource $source
 * @property int $version
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Table('run_outcomes')]
final class RunOutcome extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

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

    // ----------[ Constructors ]----------

    /**
     * The attempt's first result, unless it already has one; only the call that recorded it raises the fact.
     */
    public static function create(
        ProcessRun $run,
        string $attemptId,
        RunLogicalResult $result,
        RunResultSource $source,
    ): self {
        $outcome = new self();
        $outcome->run_id = $run->id;
        $outcome->attempt_id = $attemptId;
        $outcome->result = $result;
        $outcome->source = $source;
        $outcome->version = 1;

        $outcome->id = $outcome->newUniqueId();

        if ($outcome->insertIfAbsent()) {
            $outcome->raise(new RunOutcomeRecorded($run->id, $attemptId, $result, false));
        }

        return $outcome;
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

    // ----------[ Predicates ]----------

    public function isProvisional(): bool
    {
        return ! $this->source->isAuthoritative();
    }

    public function isResult(RunLogicalResult $result): bool
    {
        return $this->result === $result;
    }

    // ----------[ Queries ]----------

    /**
     * The result of the run's current attempt, when one was recorded.
     *
     * @return Option<self>
     */
    public static function ofRun(ProcessRun $run): Option
    {
        return Option::fromValue(self::query()->ofAttempt($run->attempt_id)->first());
    }

    /**
     * The attempt's result under its row lock, when one was recorded.
     *
     * @return Option<self>
     */
    public static function lockedForAttempt(string $attemptId): Option
    {
        return Option::fromValue(self::query()->ofAttempt($attemptId)->lockForUpdate()->first());
    }

    // ----------[ Scopes ]----------

    /**
     * The attempt's outcome.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAttempt(Builder $query, string $attemptId): void
    {
        $query->where('attempt_id', $attemptId);
    }
}
