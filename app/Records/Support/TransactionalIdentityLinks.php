<?php

declare(strict_types=1);

namespace App\Records\Support;

use App\Bus\Contracts\CommandTransaction;
use App\Links\Models\Link;
use App\Links\Support\LinkTypeRegistry;
use App\Records\Contracts\IdentityLinks;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

final readonly class TransactionalIdentityLinks implements IdentityLinks
{
    public function __construct(private LinkTypeRegistry $types, private CommandTransaction $transaction) {}

    public function link(Model $record, RecordIdentity $other): void
    {
        $this->transaction->requireRunning($record->getConnection());
        $this->types->requireRegistered($other->type);

        Link::connectKey($record, $other->type, $other->id);
    }

    public function linkedOfType(Model $record, string $type): array
    {
        $links = Link::query()->fromRecordToType($record, $type)
            ->readAll('a record links to few records of one type')
            ->get();

        $identities = $links->map(fn (Link $link) => new RecordIdentity(...$link->otherSideFrom($record)));

        return array_values($identities->all());
    }

    public function among(Builder $records, RecordIdentity $other): Builder
    {
        return Link::narrowToLinked($records, $other->type, $other->id);
    }
}
