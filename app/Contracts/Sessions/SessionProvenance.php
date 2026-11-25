<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Support\ActorIdentity;
use App\Values\Operation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

interface SessionProvenance
{
    /**
     * Notes that the record came from the session the current request runs in.
     */
    public function record(Model $record): void;

    /**
     * Notes that the record came from the same session as the source record.
     */
    public function inherit(Model $record, Model $source): void;

    /**
     * Drops what was noted about the session the record came from.
     */
    public function forget(Model $record): void;

    /**
     * Whether the record came from the session the current request runs in.
     */
    public function isFromCurrentSession(Model $record): bool;

    /**
     * @template T of Model
     *
     * @param  Builder<T>  $records
     */
    public function limitToCurrentSession(Builder $records): void;

    /**
     * @template T of Model
     *
     * @param  Builder<T>  $records
     * @return Builder<T>
     */
    public function fromSession(Builder $records, string $sessionId): Builder;

    /**
     * The actor that started the session the record came from; none when it had no parent.
     */
    public function parentOf(Model $record): ActorIdentity|null;

    /**
     * Whether the agent that started the record's session holds the grant for the operation.
     */
    public function doesParentHaveGrant(Model $record, Operation $operation): bool;
}
