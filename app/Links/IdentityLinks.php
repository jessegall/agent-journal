<?php

declare(strict_types=1);

namespace App\Links;

use App\Actors\Contracts\IdentityLinks as IdentityLinksContract;
use App\Bus\Contracts\CommandTransaction;
use App\Models\Records\Link;
use App\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

final readonly class IdentityLinks implements IdentityLinksContract
{
    public function __construct(private LinkTypeRegistry $types, private CommandTransaction $transaction) {}

    public function link(Model $record, RecordIdentity $other): void
    {
        $this->transaction->assertRunning($record->getConnection());
        $this->types->requireRegistered($other->type);

        Link::createForKey($record, $other->type, $other->id);
    }

    public function linkedOfType(Model $record, string $type): array
    {
        $links = Link::query()->fromRecordToType($record, $type)
            ->get();

        $identities = $links->map(fn (Link $link) => new RecordIdentity(...$link->otherSideFrom($record)));

        return array_values($identities->all());
    }

    public function among(Builder $records, RecordIdentity $other): Builder
    {
        return LinkedRecords::narrow($records, $other->type, $other->id);
    }
}
