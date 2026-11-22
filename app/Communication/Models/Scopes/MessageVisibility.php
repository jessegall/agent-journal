<?php

declare(strict_types=1);

namespace App\Communication\Models\Scopes;

use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Communication\Enums\MessageType;
use App\Communication\Models\Message;
use App\Communication\Support\RegisteredInboxes;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * The messages an actor may see: those of the inboxes it belongs to now, coming in or going out, those it wrote, and
 * the answers to those it wrote. Membership is read as a subquery on every read, never kept between requests.
 *
 * @implements Scope<Model>
 */
final readonly class MessageVisibility implements Scope
{
    /**
     * @param  Closure(): ActorVisibility  $visibility
     * @param  Closure(): CurrentActor  $actors
     * @param  Closure(): RegisteredInboxes  $inboxes
     * @param  Closure(): CurrentSession  $session
     */
    public function __construct(
        private Closure $visibility,
        private Closure $actors,
        private Closure $inboxes,
        private Closure $session,
    ) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        ($this->visibility)()->ownRows($builder, function (Builder $query) use ($model): void {
            $actor = ActorIdentity::of(($this->actors)()->actor());
            $inboxIds = ($this->inboxes)()->inboxIdsOf($actor);

            $query->where(fn (Builder $visible) => $visible
                ->where(function (Builder $chat) use ($model, $actor): void {
                    /** @var Builder<Message> $chat */
                    $chat->where($model->qualifyColumn('message_type'), MessageType::Chat)->receivedNowBy($actor);
                })
                ->orWhere(fn (Builder $desk) => $desk
                    ->where($model->qualifyColumn('message_type'), MessageType::Desk)
                    ->where(fn (Builder $shown) => $this->deskVisible($shown, $model, $actor, $inboxIds))));
        });
    }

    /**
     * Desk mail the actor may see: sent from or to an inbox it holds, written by it, answering what it wrote, or in
     * the conversation its session was started from.
     *
     * @param  Builder<covariant Model>  $query
     * @param  Builder<*>  $inboxIds
     */
    private function deskVisible(Builder $query, Model $model, ActorIdentity $actor, Builder $inboxIds): void
    {
        $session = ($this->session)();

        $query->whereIn($model->qualifyColumn('source_inbox_id'), $inboxIds)
            ->orWhereIn($model->qualifyColumn('destination_inbox_id'), $inboxIds)
            ->orWhere(fn (Builder $authored) => $authored
                ->where($model->qualifyColumn('sender_type'), $actor->type->value)
                ->where($model->qualifyColumn('sender_id'), $actor->id))
            ->orWhereIn($model->qualifyColumn('reply_to_id'), fn ($originals) => $originals
                ->select('id')
                ->from($model->getTable())
                ->where('sender_type', $actor->type->value)
                ->where('sender_id', $actor->id))
            ->when($session->hasSession(), fn (Builder $thread) => $thread->orWhereIn(
                $model->qualifyColumn('conversation_id'),
                Message::sourceConversation($session->sessionId()),
            ));
    }
}
