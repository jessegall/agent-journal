<?php

declare(strict_types=1);

namespace App\Models\Questions;

use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Questions\QuestionAnswerNoticeDelivered;
use App\Events\Questions\QuestionAnswerNoticeWritten;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * The asking agent's notice that its question was answered, kept until it reached one of the agent's sessions.
 *
 * @property string $id
 * @property string $question_id
 * @property string $agent_id
 * @property CarbonImmutable|null $delivered_at
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

    // ----------[ Getters ]----------

    /**
     * The key a delivery of this notice is sent under, the same on every retry.
     */
    public function deliveryKey(): string
    {
        return "question-answer:{$this->question_id}";
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
