<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\CurrentSession;
use App\Links\Models\Link;
use App\Records\Contracts\IdentityLinks;
use App\Records\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

final readonly class SessionProvenance
{
    private const string SESSION = 'core.agent-session';

    public function __construct(private CurrentSession $session, private IdentityLinks $links) {}

    public function record(Model $record): void
    {
        if ($this->session->hasSession()) {
            $this->links->link($record, new RecordIdentity(self::SESSION, $this->session->sessionId()));
        }
    }

    public function inherit(Model $record, Model $source): void
    {
        foreach ($this->links->linkedOfType($source, self::SESSION) as $origin) {
            Link::connectKey($record, $origin->type, $origin->id);
        }
    }

    public function forget(Model $record): void
    {
        Link::forgetModels([$record]);
    }

    public function isFromCurrentSession(Model $record): bool
    {
        if (! $this->session->hasSession()) {
            return false;
        }

        return $this->fromSession($record->newQuery(), $this->session->sessionId())
            ->whereKey($record->getKey())
            ->exists();
    }

    /** @param Builder<*> $records */
    public function limitToCurrentSession(Builder $records): void
    {
        $this->fromSession($records, $this->session->sessionId());
    }

    /**
     * @template T of Model
     *
     * @param Builder<T> $records
     * @return Builder<T>
     */
    public function fromSession(Builder $records, string $sessionId): Builder
    {
        return $this->links->among($records, new RecordIdentity(self::SESSION, $sessionId));
    }
}
