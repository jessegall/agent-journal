<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Models\Records\Link;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use PHPUnit\Framework\Assert;

/**
 * The links between records as the journal fixture asserts them: by the two records themselves, either way round.
 */
trait AssertsLinks
{
    /**
     * So many links join the two records, whichever is the source.
     */
    public function assertLinked(Model $first, Model $second, int $count = 1): self
    {
        Assert::assertSame($count, Link::query()->between($first, $second)->count(), 'The records are not linked so.');

        return $this;
    }

    public function assertUnlinked(Model $first, Model $second): self
    {
        return $this->assertLinked($first, $second, 0);
    }

    /**
     * So many links touch the record, as their source or their target.
     */
    public function assertLinkCount(int $count, Model $record): self
    {
        $touching = Link::query()
            ->where(fn (Builder $either) => $either
                ->where(fn (Builder $source) => $source->withSource($record))
                ->orWhere(fn (Builder $target) => $target->withTarget($record)))
            ->count();

        Assert::assertSame($count, $touching, 'A different number of links touch the record.');

        return $this;
    }
}
