<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Data\Pages\RecordCard;
use App\Exceptions\RecordUnavailable;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Model;

/**
 * A record provider over one numbered model: the owner gives the query of the records the actor may read, how one
 * looks as a card, and whether the actor may change it; reads, numbers and batches follow from those.
 *
 * @template TRecord of Model
 */
trait ProvidesModelRecords
{
    /**
     * @return ReadBuilder<TRecord>
     */
    abstract protected function readableRecords(): ReadBuilder;

    /**
     * @param  TRecord  $record
     */
    abstract protected function cardOf(Model $record): RecordCard;

    /**
     * @param  TRecord  $record
     */
    abstract protected function mayChange(Model $record): bool;

    abstract protected function linkType(): string;

    public function identityOf(int $number): RecordIdentity
    {
        $record = $this->readableRecords()->where(
            'number',
            $number,
        )->firstOr(fn () => throw RecordUnavailable::numbered(
            $this->referenceWord(),
            $number,
        ));

        return new RecordIdentity($this->linkType(), (string) $record->getKey());
    }

    public function card(RecordIdentity $record): RecordCard
    {
        return $this->cardOf($this->requireReadable($record));
    }

    /**
     * @return TRecord
     */
    public function requireReadable(RecordIdentity $record): Model
    {
        return $this->readableRecords()->whereKey($record->id)->firstOr(
            fn () => throw RecordUnavailable::forActor($record),
        );
    }

    /**
     * @return TRecord
     */
    public function requireWritable(RecordIdentity $record): Model
    {
        $readable = $this->requireReadable($record);

        if (! $this->mayChange($readable)) {
            throw RecordUnavailable::forActor($record);
        }

        return $readable;
    }

    public function visibleCards(array $records): array
    {
        $found = $this->readableRecords()->whereKey(
            array_map(fn (RecordIdentity $record) => $record->id, $records),
        )->readExactly(count($records))->get()->keyBy(fn (Model $model) => (string) $model->getKey());

        $cards = [];

        foreach ($records as $record) {
            $model = $found->get($record->id);

            if ($model !== null) {
                $cards[] = $this->cardOf($model);
            }
        }

        return $cards;
    }
}
