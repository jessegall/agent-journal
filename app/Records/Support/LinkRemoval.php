<?php

declare(strict_types=1);

namespace App\Records\Support;

use App\Bus\Contracts\CommandFacts;
use App\Links\Events\LinksRemoved;
use App\Links\Models\Link;
use App\Reads\Support\ReadBuilder;
use Illuminate\Database\Eloquent\Model;

/**
 * Removes links one at a time and tells LinksRemoved with their ids through the command's ordered stream, then runs
 * its required listeners at once, so what rested on the links ends before the caller reads on; outside a command the
 * fact is delivered at once.
 */
final readonly class LinkRemoval
{
    public function __construct(private CommandFacts $facts) {}

    /**
     * Removes every link to or from the given models, which are about to be deleted.
     *
     * @param  list<Model>  $models
     */
    public function forgetModels(array $models): void
    {
        $removed = [];

        foreach ($models as $model) {
            array_push($removed, ...$this->removeAll(Link::query()->touching($model)));
        }

        $this->announce($removed);
    }

    /**
     * Removes the link between the two models, in either direction.
     */
    public function removeBetween(Model $first, Model $second): void
    {
        $this->announce($this->removeAll(Link::query()->between($first, $second)));
    }

    /**
     * @param  ReadBuilder<Link>  $query
     * @return list<string>
     */
    private function removeAll(ReadBuilder $query): array
    {
        $links = $query->readAll('every removed link is announced by id')->get();

        return array_values($links->map(function (Link $link): string {
            $link->remove();

            return $link->id;
        })->all());
    }

    /**
     * @param  list<string>  $ids
     */
    private function announce(array $ids): void
    {
        if ($ids === []) {
            return;
        }

        $this->facts->publishAfterCommit(new LinksRemoved($ids));
        $this->facts->applyRequired();
    }
}
