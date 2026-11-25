<?php

declare(strict_types=1);

namespace App\Models\Questions;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\AuthoredModel;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Enums\QuestionType;
use App\Events\Questions\QuestionAnswered;
use App\Events\Questions\QuestionAsked;
use App\Exceptions\QuestionRefused;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A question one actor asked another in an inbox: open, or a choice between its options, answered once by its target.
 *
 * @property string $id
 * @property string $inbox_id
 * @property string $sender_type
 * @property string $sender_id
 * @property string $target_type
 * @property string $target_id
 * @property string $text
 * @property QuestionType $type
 * @property list<string> $options
 * @property string|null $answer
 * @property CarbonImmutable|null $answered_at
 * @property CarbonImmutable $created_at
 */
#[Fillable([
    'inbox_id',
    'sender_type',
    'sender_id',
    'target_type',
    'target_id',
    'text',
    'type',
    'options',
    'answer',
    'answered_at',
])]
final class Question extends Model implements AuthoredModel, EventSource, ReadableModel
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
            'type' => QuestionType::class,
            'options' => 'array',
            'answered_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * @param  list<string>  $options
     */
    public static function create(
        string $inboxId,
        ActorIdentity $sender,
        ActorIdentity $target,
        string $text,
        QuestionType $type,
        array $options,
    ): self {
        $question = self::query()->create([
            'inbox_id' => $inboxId,
            'sender_type' => $sender->type->value,
            'sender_id' => $sender->id,
            'target_type' => $target->type->value,
            'target_id' => $target->id,
            'text' => $text,
            'type' => $type,
            'options' => $options,
        ]);

        $question->raise(new QuestionAsked($question->id, $inboxId, $sender, $target));

        return $question;
    }

    // ----------[ Mutations ]----------

    /**
     * Saves the target's answer on this locked row; a second answer or a choice outside the options is refused.
     *
     * @throws QuestionRefused
     */
    public function answer(ActorIdentity $answerer, string $answer, CarbonImmutable $at): void
    {
        $this->assertAnswerable($answerer, $answer);

        $this->answer = $answer;
        $this->answered_at = $at;
        $this->save();

        $this->raise(new QuestionAnswered($this->id, $this->inbox_id, $answerer));
    }

    // ----------[ Predicates ]----------

    public function isAnswered(): bool
    {
        return $this->answered_at !== null;
    }

    // ----------[ Transformers ]----------

    public function sender(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->sender_type), $this->sender_id);
    }

    public function author(): ActorIdentity
    {
        return $this->sender();
    }

    public function target(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->target_type), $this->target_id);
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an answer by anyone but the target, a second answer, and a choice that is not one of the options.
     *
     * @throws QuestionRefused
     */
    private function assertAnswerable(ActorIdentity $answerer, string $answer): void
    {
        if (! $this->target()->isSameAs($answerer)) {
            throw QuestionRefused::notTheTarget($this->id);
        }

        if ($this->isAnswered()) {
            throw QuestionRefused::alreadyAnswered($this->id);
        }

        if ($this->type === QuestionType::Choice && ! in_array($answer, $this->options, true)) {
            throw QuestionRefused::notAnOption($this->id);
        }
    }

    // ----------[ Queries ]----------

    public static function lockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }
}
