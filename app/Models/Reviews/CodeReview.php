<?php

declare(strict_types=1);

namespace App\Models\Reviews;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Assignments\ActorType;
use App\Enums\Reviews\CodeReviewState;
use App\Events\Reviews\CodeReviewImportFailed;
use App\Events\Reviews\CodeReviewOpened;
use App\Events\Reviews\CodeReviewSettled;
use App\Exceptions\CodeReviewRefused;
use App\Models\Asks\Ask;
use App\Models\Support\Accessor;
use App\Models\Support\HasWorkColumns;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Values\AskReference;
use App\Values\HelperImportReceipt;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $certificate
 * @property string $work_type
 * @property string $work_id
 * @property string $worker_type
 * @property string $worker_id
 * @property CodeReviewState $state
 * @property ?string $import_ref
 * @property ?string $base
 * @property ?string $head
 * @property int $import_attempts
 * @property ?string $import_failure
 * @property ?string $origin_target
 * @property ?string $ask_id
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $worker attribute
 * @property ReviewDecision $decision
 */
#[Table('code_reviews')]
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

    // ----------[ Constructors ]----------

    /**
     * The review of reserved work, retained once per certificate.
     */
    public static function create(WorkReservation $reservation): self
    {
        $work = $reservation->certifiedWork->work();
        $worker = $reservation->actor();

        $review = new self();
        $review->certificate = $reservation->certificate;
        $review->work_type = $work->type;
        $review->work_id = $work->id;
        $review->worker_type = $worker->type->value;
        $review->worker_id = $worker->id;
        $review->state = CodeReviewState::AwaitingImport;
        $review->import_attempts = 0;

        $review->setAttribute($review->getKeyName(), $review->newUniqueId());
        $review->insertIfAbsent();

        return self::query()->withCertificate($reservation->certificate)->sole();
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

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<ActorIdentity, never>
     */
    protected function worker(): Attribute
    {
        return Accessor::get(fn () => new ActorIdentity(ActorType::from($this->worker_type), $this->worker_id));
    }

    // ----------[ Relations ]----------

    /**
     * @return HasOne<ReviewDecision, $this>
     */
    public function decision(): HasOne
    {
        return $this->hasOne(ReviewDecision::class);
    }

    // ----------[ Queries ]----------

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
