<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandTransaction;
use App\Contracts\Records\RecordLinker;
use App\Contracts\Records\RecordResolver;
use App\Models\Records\Link;
use Illuminate\Database\Eloquent\Model;

final readonly class TransactionalRecordLinker implements RecordLinker
{
    public function __construct(
        private RecordResolver $records,
        private CommandTransaction $transaction,
        private LinkRemoval $removal,
    ) {}

    public function linkFrom(Model $source, array $targets): void
    {
        $this->transaction->assertRunning($source->getConnection());

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
        $this->removal->removeBetween($from, $to);
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
        $this->transaction->assertRunning($from->getConnection());
        $ordered = [$from, $to];

        usort(
            $ordered,
            fn (Model $one, Model $other) => [$one->getMorphClass(), (string) $one->getKey()] <=> [
                $other->getMorphClass(),
                (string) $other->getKey(),
            ],
        );

        self::lock($ordered[0]);
        self::lock($ordered[1]);

        return [$from, $to];
    }

    private static function lock(Model $record): void
    {
        $record->newQuery()->whereKey($record->getKey())->lockForUpdate()->first();
    }
}
