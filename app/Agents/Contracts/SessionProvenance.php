<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Actors\Support\ActorContext;
use App\Agents\Values\Operation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

interface SessionProvenance
{
    public function record(Model $record): void;

    public function inherit(Model $record, Model $source): void;

    public function forget(Model $record): void;

    public function isFromCurrentSession(Model $record): bool;

    /**
     * @template T of Model
     *
     * @param  Builder<T>  $records
     */
    public function limitToCurrentSession(Builder $records): void;

    /**
     * @template T of Model
     * @param Builder<T> $records
     * @return Builder<T>
     */
    public function fromSession(Builder $records, string $sessionId): Builder;

    public function parentOf(Model $record): ActorContext|null;

    public function parentHasGrant(Model $record, Operation $operation): bool;
}
