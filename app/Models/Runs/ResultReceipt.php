<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Runs\AssessmentOutcome;
use App\Events\Processes\ResultReceiptSuperseded;
use App\Values\PublishedResult;
use App\Values\VerifiedOutput;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $project_key
 * @property string $process_run_id
 * @property string $part_run_id
 * @property int $attempt
 * @property string $work_fingerprint
 * @property string $rule_revision_id
 * @property string $reader_revision_id
 * @property string $exit_policy_digest
 * @property string $manifest_digest
 * @property string $output_assessment_id
 * @property AssessmentOutcome $outcome
 * @property ?string $superseded_by_id
 * @property Carbon $published_at
 */
final class ResultReceipt extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string CREATED_AT = 'published_at';

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attempt' => 'integer',
            'outcome' => AssessmentOutcome::class,
            'published_at' => 'datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The receipt of a verified output, bound to its run, part, revisions, manifest and assessment.
     */
    public static function create(VerifiedOutput $verified, string $exitPolicyDigest): self
    {
        $resultReceipt = new self();
        $resultReceipt->project_key = $verified->run->project_key;
        $resultReceipt->process_run_id = $verified->run->id;
        $resultReceipt->part_run_id = $verified->part->id;
        $resultReceipt->attempt = $verified->part->attempt;
        $resultReceipt->work_fingerprint = $verified->run->tree_digest;
        $resultReceipt->rule_revision_id = $verified->declaration->id;
        $resultReceipt->reader_revision_id = $verified->assessment->reader_revision_id;
        $resultReceipt->exit_policy_digest = $exitPolicyDigest;
        $resultReceipt->manifest_digest = $verified->manifestDigest;
        $resultReceipt->output_assessment_id = $verified->assessment->id;
        $resultReceipt->outcome = $verified->assessment->outcome;
        $resultReceipt->assertSaved($resultReceipt->save());

        return $resultReceipt;
    }

    // ----------[ Mutations ]----------

    /**
     * This receipt no longer stands: a newer one for the same part replaced it.
     */
    public function supersedeBy(self $newer): void
    {
        $this->superseded_by_id = $newer->id;
        $this->assertSaved($this->save());
        $this->raise(new ResultReceiptSuperseded($this->id, $newer->id));
    }

    // ----------[ Predicates ]----------

    public function isCurrent(): bool
    {
        return $this->superseded_by_id === null;
    }

    // ----------[ Transformers ]----------

    /**
     * This receipt as another domain reads it.
     */
    public function published(): PublishedResult
    {
        $publishedAt = $this->published_at->toImmutable();

        return new PublishedResult($this->id, $this->process_run_id, $this->operation(), $this->outcome, $publishedAt);
    }

    // ----------[ Calculations ]----------

    /**
     * The canonical operation of the part this receipt is the result of.
     */
    public function operation(): string
    {
        return PartRun::query()->whereKey($this->part_run_id)->value('operation');
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function current(Builder $query): void
    {
        $query->whereNull('superseded_by_id');
    }

    /**
     * The rows of the given part run.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofPartRun(Builder $query, string $runId): void
    {
        $query->where('part_run_id', $runId);
    }
}
