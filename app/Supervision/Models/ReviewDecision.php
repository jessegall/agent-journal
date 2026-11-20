<?php

declare(strict_types=1);

namespace App\Supervision\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Supervision\Enums\ReviewDecisionType;
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
final class ReviewDecision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

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

    // ----------[ Mutations ]----------

    public function linkMerge(Ask $merge): void
    {
        $this->merge_ask_id = $merge->id;
        $this->save();
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
