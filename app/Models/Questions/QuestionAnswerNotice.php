<?php

declare(strict_types=1);

namespace App\Models\Questions;

use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Questions\QuestionAnswerNoticeDelivered;
use App\Events\Questions\QuestionAnswerNoticeWritten;
use App\Models\Support\Accessor;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $question_id
 * @property string $agent_id
 * @property ?CarbonImmutable $delivered_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $delivery_key attribute
 * @property Question $question
 */
#[Fillable([
    'question_id',
    'agent_id',
    'delivered_at',
])]
final class QuestionAnswerNotice extends Model implements EventSource
{
    use HasUlids;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['delivered_at' => 'immutable_datetime'];
    }

    // ----------[ Mutations ]----------

    public function markDelivered(CarbonImmutable $at): void
    {
        $this->delivered_at = $at;
        $this->save();

        $this->raise(new QuestionAnswerNoticeDelivered($this->id, $this->question_id));
    }

    // ----------[ Accessors ]----------

    /**
     * The key a delivery of this notice is sent under, the same on every retry.
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function deliveryKey(): Attribute
    {
        return Accessor::get(fn (): string => "question-answer:{$this->question_id}");
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Question, $this>
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    // ----------[ Queries ]----------

    public static function write(Question $question, string $agentId): self
    {
        $notice = self::query()->firstOrCreate(['question_id' => $question->id], ['agent_id' => $agentId]);

        if ($notice->wasRecentlyCreated) {
            $notice->raise(new QuestionAnswerNoticeWritten($notice->id, $question->id, $agentId));
        }

        return $notice;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function undeliveredFor(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId)->whereNull('delivered_at')->orderBy('created_at')->orderBy('id');
    }
}
