<?php

declare(strict_types=1);

namespace Domain\Questions\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\Accessor;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Questions\Events\QuestionAnswerNoticeDelivered;
use Domain\Questions\Events\QuestionAnswerNoticeWritten;
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
 * @property string $recipient_type
 * @property string $recipient_id
 * @property ?CarbonImmutable $delivered_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $delivery_key attribute
 * @property Question $question
 */
final class QuestionAnswerNotice extends Model implements EventSource, ReadableModel
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
        return Accessor::get(fn () => "question-answer:{$this->question_id}");
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

    public static function write(Question $question, ActorIdentity $recipient): self
    {
        $existing = self::query()->ofQuestion($question->id)->first();

        if ($existing !== null) {
            return $existing;
        }

        $notice = new self();
        $notice->question_id = $question->id;
        $notice->recipient_type = $recipient->type;
        $notice->recipient_id = $recipient->id;
        $notice->assertSaved($notice->save());
        $notice->raise(new QuestionAnswerNoticeWritten($notice->id, $question->id, $recipient));

        return $notice;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofQuestion(Builder $query, string $questionId): void
    {
        $query->where('question_id', $questionId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function undeliveredFor(Builder $query, ActorIdentity $recipient): void
    {
        $query->where(
            'recipient_type',
            $recipient->type,
        )->where('recipient_id', $recipient->id)->whereNull('delivered_at')->orderBy('created_at')->orderBy('id');
    }
}
