<?php

declare(strict_types=1);

namespace App\Supervision\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Models\WorkReservation;
use App\Agents\Values\HelperImportReceipt;
use App\Contracts\Support\InsertsAbsentRows;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Models\Support\HasWorkColumns;
use App\Records\Support\RecordIdentity;
use App\Supervision\Enums\CodeReviewState;
use App\Supervision\Exceptions\CodeReviewRefused;
use App\Supervision\Values\AskReference;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * The review of one piece of certified work: the worker that did it, the ref its commits were imported under, the
 * base and head that were reviewed as the journal read them from git, the route its review ask first took, and the
 * ask a reviewer answers with a typed decision. An import that fails keeps the review waiting with its reason.
 *
 * @property string $id
 * @property string $certificate
 * @property string $work_type
 * @property string $work_id
 * @property string $worker_type
 * @property string $worker_id
 * @property CodeReviewState $state
 * @property string|null $import_ref
 * @property string|null $base
 * @property string|null $head
 * @property int $import_attempts
 * @property string|null $import_failure
 * @property string|null $origin_target
 * @property string|null $ask_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read ReviewDecision|null $decision
 */
#[Table('code_reviews')]
#[Fillable([
    'certificate',
    'work_type',
    'work_id',
    'worker_type',
    'worker_id',
    'state',
    'import_ref',
    'base',
    'head',
    'import_attempts',
    'import_failure',
    'origin_target',
    'ask_id',
])]
final class CodeReview extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use HasWorkColumns;
    use InsertsAbsentRows;
    use Linkable;

    /**
     * How many failed imports leave the review waiting for someone to look.
     */
    public const int IMPORT_ATTEMPT_LIMIT = 5;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['state' => CodeReviewState::class, 'import_attempts' => 'integer'];
    }

    // ----------[ Queries ]----------

    /**
     * The review of reserved work, retained once per certificate.
     */
    public static function retain(WorkReservation $reservation): self
    {
        $work = $reservation->certifiedWork->work();
        $worker = $reservation->actor();

        $review = new self([
            'certificate' => $reservation->certificate,
            'work_type' => $work->type,
            'work_id' => $work->id,
            'worker_type' => $worker->type->value,
            'worker_id' => $worker->id,
            'state' => CodeReviewState::AwaitingImport,
            'import_attempts' => 0,
        ]);

        $review->setAttribute($review->getKeyName(), $review->newUniqueId());
        $review->insertIfAbsent();

        return self::query()->where('certificate', $reservation->certificate)->sole();
    }

    /**
     * @throws CodeReviewRefused
     */
    public static function openFor(AskReference $ask): self
    {
        return self::query()
            ->where('ask_id', $ask->id)
            ->where('state', CodeReviewState::Open->value)
            ->lockForUpdate()
            ->firstOr(fn () => throw CodeReviewRefused::notOpen($ask->id));
    }

    /**
     * The latest review of one work, locked.
     */
    public static function latestFor(RecordIdentity $work): self
    {
        return self::query()
            ->where('work_type', $work->type)
            ->where('work_id', $work->id)
            ->latest()
            ->lockForUpdate()
            ->firstOrFail();
    }

    // ----------[ Mutations ]----------

    public function failImport(string $reason): void
    {
        $this->import_attempts++;
        $this->import_failure = $reason;
        $this->save();
    }

    /**
     * Opens the review on what the import brought in and the ask its reviewer answers, keeping the first target of
     * that ask as the review's origin role, whoever answers it in the end.
     */
    public function open(HelperImportReceipt $import, Ask $ask): void
    {
        $this->state = CodeReviewState::Open;
        $this->import_ref = $import->ref;
        $this->base = $import->base;
        $this->head = $import->head;
        $this->import_failure = null;
        $this->ask_id = $ask->id;
        $this->origin_target = $ask->pending_target;
        $this->save();
    }

    public function settle(CodeReviewState $state): void
    {
        $this->state = $state;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function isAwaitingImport(): bool
    {
        return $this->state === CodeReviewState::AwaitingImport;
    }

    public function hasImportAttemptsLeft(): bool
    {
        return $this->import_attempts < self::IMPORT_ATTEMPT_LIMIT;
    }

    public function worker(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->worker_type), $this->worker_id);
    }

    // ----------[ Relations ]----------

    /**
     * @return HasOne<ReviewDecision, $this>
     */
    public function decision(): HasOne
    {
        return $this->hasOne(ReviewDecision::class);
    }
}
