<?php

declare(strict_types=1);

namespace App\Records\Support;

use App\Assignments\Support\RecordIdentity;
use App\Bus\Contracts\CommandTransaction;
use App\Links\Models\Link;
use App\Records\Contracts\RecordLinker;
use App\Records\Contracts\RecordReader;
use Illuminate\Database\Eloquent\Model;

final readonly class TransactionalRecordLinker implements RecordLinker
{
    public function __construct(private RecordReader $records, private CommandTransaction $transaction) {}

    public function linkFrom(Model $source, array $targets): void
    {
        $this->transaction->requireRunning($source->getConnection());

        foreach ($targets as $target) {
            Link::connect($source, $this->records->requireReadable($target));
        }
    }

    public function link(RecordIdentity $source, RecordIdentity $target): void
    {
        [$from, $to] = $this->lockedPair($source, $target);
        Link::connect($from, $to);
    }

    public function unlink(RecordIdentity $source, RecordIdentity $target): void
    {
        [$from, $to] = $this->lockedPair($source, $target);
        Link::query()->between($from, $to)->delete();
    }

    /**
     * The source the actor may change and the target they may read, locked in alias and id order so two writers
     * never wait on each other the other way round.
     *
     * @return array{Model, Model}
     */
    private function lockedPair(RecordIdentity $source, RecordIdentity $target): array
    {
        $from = $this->records->requireWritable($source);
        $to = $this->records->requireReadable($target);
        $this->transaction->requireRunning($from->getConnection());
        $ordered = [$from, $to];
        usort($ordered, fn (Model $one, Model $other) => [$one->getMorphClass(), (string) $one->getKey()] <=> [$other->getMorphClass(), (string) $other->getKey()]);

        foreach ($ordered as $model) {
            $model->newQuery()->whereKey($model->getKey())->lockForUpdate()->first();
        }

        return [$from, $to];
    }
}
