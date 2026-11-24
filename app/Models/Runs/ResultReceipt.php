<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\AssessmentOutcome;
use App\Events\Processes\ResultReceiptSuperseded;
use App\Values\PublishedResult;
use App\Values\VerifiedOutput;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The one result a consumer may rely on: it binds the run, part and attempt,
 * the work it saw, the declaration, reader and exit-policy revisions, the capture manifest and the valid assessment it
 * was published from. Only the ReceiptPublisher writes it; a newer receipt for the same part supersedes it.
 *
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
 * @property string|null $superseded_by_id
 * @property Carbon $published_at
 */
#[Fillable([
    'project_key',
    'process_run_id',
    'part_run_id',
    'attempt',
    'work_fingerprint',
    'rule_revision_id',
    'reader_revision_id',
    'exit_policy_digest',
    'manifest_digest',
    'output_assessment_id',
    'outcome',
])]
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
        return ['attempt' => 'integer', 'outcome' => AssessmentOutcome::class, 'published_at' => 'datetime'];
    }

    // ----------[ Constructors ]----------

    /**
     * The receipt of a verified output, bound to its run, part, revisions, manifest and assessment.
     */
    public static function create(VerifiedOutput $verified, string $exitPolicyDigest): self
    {
        return self::query()->create([
            'project_key' => $verified->run->project_key,
            'process_run_id' => $verified->run->id,
            'part_run_id' => $verified->part->id,
            'attempt' => $verified->part->attempt,
            'work_fingerprint' => $verified->run->tree_digest,
            'rule_revision_id' => $verified->declaration->id,
            'reader_revision_id' => $verified->assessment->reader_revision_id,
            'exit_policy_digest' => $exitPolicyDigest,
            'manifest_digest' => $verified->manifestDigest,
            'output_assessment_id' => $verified->assessment->id,
            'outcome' => $verified->assessment->outcome,
        ]);
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

    // ----------[ Answers ]----------

    /**
     * The canonical operation of the part this receipt is the result of.
     */
    public function operation(): string
    {
        return PartRun::query()->whereKey($this->part_run_id)->value('operation');
    }

    public function isCurrent(): bool
    {
        return $this->superseded_by_id === null;
    }

    /**
     * This receipt as another domain reads it.
     */
    public function published(): PublishedResult
    {
        $publishedAt = $this->published_at->toImmutable();

        return new PublishedResult($this->id, $this->process_run_id, $this->operation(), $this->outcome, $publishedAt);
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
}
