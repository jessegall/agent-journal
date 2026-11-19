<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Support\ActorContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Whose request keys a receipt belongs to: the actor that sent the write, and for an agent the session of its signed
 * call. One database holds one installation, so the installation is the database itself.
 */
final readonly class ReceiptCaller
{
    private function __construct(public ActorContext $actor, public string|null $sessionId) {}

    public static function inSession(ActorContext $actor, string $sessionId): self
    {
        return new self($actor, $sessionId);
    }

    public static function withoutSession(ActorContext $actor): self
    {
        return new self($actor, null);
    }

    /**
     * Limits a receipt query to this caller's keys.
     *
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $query
     */
    public function limit(Builder $query): void
    {
        $query->where($query->qualifyColumn('author_type'), $this->actor->type->value)
            ->where($query->qualifyColumn('author_id'), $this->actor->id)
            ->where($query->qualifyColumn('session_id'), $this->sessionId);
    }

    /**
     * Limits a receipt query to the keys this caller may read back: its session's own and those its actor keeps
     * across sessions.
     *
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $query
     */
    public function limitReadable(Builder $query): void
    {
        $query->where($query->qualifyColumn('author_type'), $this->actor->type->value)
            ->where($query->qualifyColumn('author_id'), $this->actor->id)
            ->where(fn (Builder $sessions) => $sessions
                ->where($query->qualifyColumn('session_id'), $this->sessionId)
                ->orWhereNull($query->qualifyColumn('session_id')));
    }

    /**
     * The columns a new receipt of this caller is stored with.
     *
     * @return array{author_type: string, author_id: string, session_id: string|null}
     */
    public function columns(): array
    {
        return [
            'author_type' => $this->actor->type->value,
            'author_id' => $this->actor->id,
            'session_id' => $this->sessionId,
        ];
    }
}
