<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Models\Support\VisibleActorScope;
use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\MessageState;
use App\Communication\Enums\MessageWorkState;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Exceptions\MessageRoundStale;
use App\Communication\Support\MessageWork;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope as QueryScope;
use Illuminate\Support\Carbon;

/**
 * One message. When it needs an answer, the actor that owes it is set by asking for the answer. Only the actor it
 * is addressed to reads it, as that actor's visibility says; a message not yet addressed belongs to no actor.
 *
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $body
 * @property MessageState $state
 * @property int $answer_round the round of asking for an answer; 0 before anyone was asked
 * @property string|null $actor_type
 * @property string|null $actor_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['body'])]
final class Message extends Model implements Numbered, ReadableModel
{
    use BelongsToOneActor, HasNumber, HasUlids;
    use BoundedReads;
    use Linkable;

    public const string LINK_TYPE = 'communication.message';

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['state' => 'sent', 'answer_round' => 0];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => MessageState::class,
            'answer_round' => 'integer',
        ];
    }

    /**
     * A new message with its body, before anyone is asked to answer it.
     */
    public static function write(string $body): self
    {
        return self::query()->create(['body' => $body]);
    }

    /**
     * The message read under its row lock, among those the actor may see, for a change that must happen once.
     */
    public static function lockedById(string $id): self
    {
        // A message belongs to no actor until one is asked to answer it.
        return self::lockedForActorOrUnheld($id) ?? throw MessageMissing::forId($id);
    }

    /**
     * The message's first line, the only text a link card shows of it.
     */
    public function firstLine(): string
    {
        return mb_strimwidth(strtok($this->body, "\n") ?: '', 0, 80, '…');
    }

    /**
     * Opens a new round of asking the actor for an answer, so a frame of an earlier round stays finished.
     */
    public function requireAnswerFrom(ActorIdentity $actor): void
    {
        $this->answer_round++;
        $this->state = MessageState::WaitingForAnswer;
        $this->belongTo($actor);
        $this->save();
    }

    /**
     * @return QueryScope<Model>
     */
    protected static function actorScope(): QueryScope
    {
        return new VisibleActorScope(
            static fn (): ActorVisibility => Container::getInstance()->make(ActorVisibility::class),
            static fn (): CurrentActor => Container::getInstance()->make(CurrentActor::class),
        );
    }

    /**
     * @return class-string<QueryScope<Model>>
     */
    protected static function ownerScope(): string
    {
        return VisibleActorScope::class;
    }

    /**
     * Refuses a change made for a round that is no longer the current one.
     *
     * @throws MessageRoundStale
     */
    public function requireRound(int $round): void
    {
        if ($round !== $this->answer_round) {
            throw MessageRoundStale::for($this->number, $round, $this->answer_round);
        }
    }

    public function markAnswered(): void
    {
        $this->state = MessageState::Answered;
        $this->save();
    }

    public function dismiss(): void
    {
        $this->state = MessageState::Dismissed;
        $this->save();
    }

    public function work(): MessageWork
    {
        return $this->workIn($this->answer_round);
    }

    /**
     * The work of one round: a round older than the current one is over, whatever the message's state is now.
     */
    public function workIn(int $round): MessageWork
    {
        $state = $round < $this->answer_round ? MessageWorkState::Answered : MessageWorkState::of($this->state);

        return new MessageWork($this->number, $state, $round);
    }
}
