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
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * A reviewer's one typed decision on a code review: who decided, on which exact base and head, what they found, and
 * the merge ask an approval opened or the repair a return asks for. Only this decision approves work; no test result
 * or text does.
 *
 * @property string $id
 * @property string $code_review_id
 * @property ReviewDecisionType $decision
 * @property string $reviewer_type
 * @property string $reviewer_id
 * @property string $base
 * @property string $head
 * @property string $findings
 * @property string|null $merge_ask_id
 * @property Carbon|null $repaired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read CodeReview $review
 */
#[Table('review_decisions')]
#[Fillable([
    'code_review_id',
    'decision',
    'reviewer_type',
    'reviewer_id',
    'base',
    'head',
    'findings',
    'merge_ask_id',
    'repaired_at',
])]
final class ReviewDecision extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['decision' => ReviewDecisionType::class, 'repaired_at' => 'datetime'];
    }

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

    // ----------[ Queries ]----------

    /**
     * The id of the approval whose merge the ask asks for, when one names it.
     */
    public static function idMerging(string $askId): string|null
    {
        $id = self::query()->where('merge_ask_id', $askId)->value('id');

        return $id === null ? null : (string) $id;
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
}
