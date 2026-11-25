<?php

declare(strict_types=1);

namespace App\Models\Questions;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\AuthoredModel;
use App\Contracts\Records\ReadableModel;
use App\Enums\Questions\QuestionType;
use App\Events\Questions\QuestionAnswered;
use App\Events\Questions\QuestionAsked;
use App\Exceptions\QuestionRefused;
use App\Models\Support\Accessor;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $inbox_id
 * @property string $sender_type
 * @property string $sender_id
 * @property string $target_type
 * @property string $target_id
 * @property string $text
 * @property QuestionType $type
 * @property array $options
 * @property ?string $answer
 * @property ?CarbonImmutable $answered_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $sender attribute
 * @property mixed $target attribute
 */
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
        $question = new self();
        $question->inbox_id = $inboxId;
        $question->sender_type = $sender->type;
        $question->sender_id = $sender->id;
        $question->target_type = $target->type;
        $question->target_id = $target->id;
        $question->text = $text;
        $question->type = $type;
        $question->options = $options;
        $question->assertSaved($question->save());

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

    public function author(): ActorIdentity
    {
        return $this->sender;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<ActorIdentity, never>
     */
    protected function sender(): Attribute
    {
        return Accessor::get(fn () => ActorIdentity::fromStored($this->sender_type, $this->sender_id));
    }

    /**
     * @return Attribute<ActorIdentity, never>
     */
    protected function target(): Attribute
    {
        return Accessor::get(fn () => ActorIdentity::fromStored($this->target_type, $this->target_id));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an answer by anyone but the target, a second answer, and a choice that is not one of the options.
     *
     * @throws QuestionRefused
     */
    private function assertAnswerable(ActorIdentity $answerer, string $answer): void
    {
        if (! $this->target->isSameAs($answerer)) {
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

    /**
     * The rows of the given target.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofTarget(Builder $query, string $targetId): void
    {
        $query->where('target_id', $targetId);
    }

    /**
     * The rows of the given target type.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withTargetType(Builder $query, string $targetType): void
    {
        $query->where('target_type', $targetType);
    }

    /**
     * The rows of the given inbox.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofInbox(Builder $query, string $inboxId): void
    {
        $query->where('inbox_id', $inboxId);
    }
}
