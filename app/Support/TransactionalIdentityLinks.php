<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\CommandTransaction;
use App\Contracts\IdentityLinks;
use App\Models\Link;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

final readonly class TransactionalIdentityLinks implements IdentityLinks
{
    public function __construct(private LinkTypeRegistry $types, private CommandTransaction $transaction) {}

    public function link(Model $record, RecordIdentity $other): void
    {
        $this->transaction->assertRunning($record->getConnection());
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
