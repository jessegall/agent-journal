<?php

declare(strict_types=1);

namespace Domain\Questions\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Projects\ProjectOwned;
use App\Contracts\Records\AuthoredModel;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToProject;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Domain\Questions\Enums\QuestionType;
use Domain\Questions\Events\QuestionAnswered;
use Domain\Questions\Events\QuestionAsked;
use Domain\Questions\Exceptions\QuestionRefused;
use Domain\Questions\Support\ShownQuestion;
use Domain\Questions\Values\QuestionSummary;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property string $id
 * @property string $project_id
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
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $sender
 * @property-read mixed $shown
 * @property-read mixed $summary
 * @property-read mixed $target
 *
 * @mixin \Eloquent
 */
final class Question extends JournalModel implements AuthoredModel, EventSource, ProjectOwned, ReadableModel
{
    use BelongsToProject;
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     *
     * @column options list<string>
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
     * A question of the asker's project.
     *
     * @param  list<string>  $options
     */
    public static function create(
        ProjectOwner $owner,
        string $inboxId,
        ActorReference $sender,
        ActorReference $target,
        string $text,
        QuestionType $type,
        array $options,
    ): self {
        $question = new self();
        $question->project_id = $owner->projectId();
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
    public function answer(ActorReference $answeredBy, string $answer, CarbonImmutable $at): void
    {
        $this->assertAnswerable($answeredBy, $answer);

        $this->answer = $answer;
        $this->answered_at = $at;
        $this->save();

        $this->raise(new QuestionAnswered($this->id, $this->inbox_id, $answeredBy));
    }

    // ----------[ Predicates ]----------

    public function isAnswered(): bool
    {
        return $this->answered_at !== null;
    }

    // ----------[ Transformers ]----------

    public function author(): ActorReference
    {
        return $this->sender;
    }

    // ----------[ Accessors ]----------

    /**
     * The question as another domain shows it: its first line and its inbox.
     *
     * @return Attribute<QuestionSummary, never>
     */
    protected function summary(): Attribute
    {
        return Accessor::get(function () {
            $firstLine = strtok($this->text, "\n");

            if ($firstLine === false) {
                return new QuestionSummary($this->id, $this->text, $this->inbox_id, $this->project_id);
            }

            return new QuestionSummary($this->id, $firstLine, $this->inbox_id, $this->project_id);
        });
    }

    /**
     * The question as an agent or a page reads it, with its answer once it has one.
     *
     * @return Attribute<ShownQuestion, never>
     */
    protected function shown(): Attribute
    {
        return Accessor::get(fn () => new ShownQuestion(
            $this->id,
            $this->inbox_id,
            $this->sender_type,
            $this->sender_id,
            $this->target_type,
            $this->target_id,
            $this->text,
            $this->type->value,
            $this->options,
            $this->answer,
            $this->answered_at?->toIso8601String(),
            $this->created_at->toIso8601String(),
        ));
    }

    /**
     * @return Attribute<ActorReference, never>
     */
    protected function sender(): Attribute
    {
        return Accessor::get(fn () => ActorReference::fromStored($this->sender_type, $this->sender_id));
    }

    /**
     * @return Attribute<ActorReference, never>
     */
    protected function target(): Attribute
    {
        return Accessor::get(fn () => ActorReference::fromStored($this->target_type, $this->target_id));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an answer by anyone but the target, a second answer, and a choice that is not one of the options.
     *
     * @throws QuestionRefused
     */
    private function assertAnswerable(ActorReference $answeredBy, string $answer): void
    {
        if (! $this->target->isSameAs($answeredBy)) {
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

    public static function findLockedById(string $id): self
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
