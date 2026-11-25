<?php

declare(strict_types=1);

namespace App\Models\Reviews;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ReviewDecisionType;
use App\Events\Reviews\ReviewDecisionMergeLinked;
use App\Models\Asks\Ask;
use App\Support\ActorIdentity;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $code_review_id
 * @property ReviewDecisionType $decision
 * @property string $reviewer_type
 * @property string $reviewer_id
 * @property string $base
 * @property string $head
 * @property string $findings
 * @property ?string $merge_ask_id
 * @property ?Carbon $repaired_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property CodeReview $review
 */
#[Table('review_decisions')]
final class ReviewDecision extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'decision' => ReviewDecisionType::class,
            'repaired_at' => 'datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Records the reviewer's decision on the exact base and head the review was opened on.
     */
    public static function create(
        CodeReview $review,
        ReviewDecisionType $decision,
        ActorIdentity $reviewer,
        string $findings,
    ): self {
        $made = new self();
        $made->code_review_id = $review->id;
        $made->decision = $decision;
        $made->reviewer_type = $reviewer->type->value;
        $made->reviewer_id = $reviewer->id;
        $made->base = (string) $review->base;
        $made->head = (string) $review->head;
        $made->findings = $findings;
        $made->save();

        return $made;
    }

    // ----------[ Mutations ]----------

    public function linkMerge(Ask $merge): void
    {
        $this->merge_ask_id = $merge->id;
        $this->assertSaved($this->save());
        $this->raise(new ReviewDecisionMergeLinked($this->id, $merge->id));
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<CodeReview, $this>
     */
    public function review(): BelongsTo
    {
        return $this->belongsTo(CodeReview::class, 'code_review_id');
    }

    // ----------[ Queries ]----------

    /**
     * The id of the approval whose merge the ask asks for, when one names it.
     */
    public static function idMerging(string $askId): string|null
    {
        $id = self::query()->mergingFor($askId)->value('id');

        if ($id === null) {
            return null;
        }

        return (string) $id;
    }

    // ----------[ Scopes ]----------

    /**
     * The decision whose merge the ask carries.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function mergingFor(Builder $query, string $askId): void
    {
        $query->where('merge_ask_id', $askId);
    }

    /**
     * The rows with their review loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withReview(Builder $query): void
    {
        $query->with('review');
    }
}
