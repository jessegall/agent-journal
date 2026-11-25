<?php

declare(strict_types=1);

namespace App\Models\Reviews;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Enums\CodeReviewState;
use App\Events\Reviews\CodeReviewImportFailed;
use App\Events\Reviews\CodeReviewOpened;
use App\Events\Reviews\CodeReviewSettled;
use App\Exceptions\CodeReviewRefused;
use App\Models\Asks\Ask;
use App\Models\Support\HasWorkColumns;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Values\AskReference;
use App\Values\HelperImportReceipt;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
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
final class CodeReview extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use HasWorkColumns;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * How many failed imports leave the review waiting for someone to look.
     */
    public const int IMPORT_ATTEMPT_LIMIT = 5;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => CodeReviewState::class,
            'import_attempts' => 'integer',
        ];
    }

    // ----------[ Mutations ]----------

    public function failImport(string $reason): void
    {
        $this->import_attempts++;
        $this->import_failure = $reason;
        $this->assertSaved($this->save());
        $this->raise(new CodeReviewImportFailed($this->id));
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
        $this->assertSaved($this->save());
        $this->raise(new CodeReviewOpened($this->id, $ask->id));
    }

    public function settle(CodeReviewState $state): void
    {
        $this->state = $state;
        $this->assertSaved($this->save());
        $this->raise(new CodeReviewSettled($this->id, $state));
    }

    // ----------[ Predicates ]----------

    public function isAwaitingImport(): bool
    {
        return $this->state === CodeReviewState::AwaitingImport;
    }

    public function hasImportAttemptsLeft(): bool
    {
        return $this->import_attempts < self::IMPORT_ATTEMPT_LIMIT;
    }

    // ----------[ Transformers ]----------

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

    // ----------[ Asserts ]----------

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

        return self::query()->withCertificate($reservation->certificate)->sole();
    }

    /**
     * @throws CodeReviewRefused
     */
    public static function openFor(AskReference $ask): self
    {
        return self::query()
            ->ofAsk($ask)
            ->inOpenState()
            ->lockForUpdate()->firstOr(CodeReviewRefused::throwing()->notOpen($ask->id));
    }

    /**
     * The latest review of one work, locked.
     */
    public static function latestFor(RecordIdentity $work): self
    {
        return self::query()
            ->ofWork($work)
            ->newestFirst()
            ->lockForUpdate()
            ->firstOrFail();
    }

    // ----------[ Scopes ]----------

    /**
     * The review of the certified work.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withCertificate(Builder $query, string $certificate): void
    {
        $query->where('certificate', $certificate);
    }

    /**
     * The review the ask carries.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAsk(Builder $query, AskReference $ask): void
    {
        $query->where('ask_id', $ask->id);
    }

    /**
     * The open reviews.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inOpenState(Builder $query): void
    {
        $query->where('state', CodeReviewState::Open->value);
    }

    /**
     * The reviews of the work.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofWork(Builder $query, RecordIdentity $work): void
    {
        $query->where('work_type', $work->type)->where('work_id', $work->id);
    }
}
