<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Readers;

use App\Domain\Contracts\NavigationChildren;
use App\Domain\Declarations\NavigationItem;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * The months the calling actor wrote notes in, newest first, each as a navigation item for its collection page.
 */
final readonly class CollectionChildren implements NavigationChildren
{
    public function children(): array
    {
        $months = array_values(array_unique(array_map(
            fn (string $createdAt) => substr($createdAt, 0, 7),
            array_map(strval(...), Note::query()->forActor()->orderByDesc('created_at')->pluck('created_at')->all()),
        )));

        return array_map(fn (string $month) => NavigationItem::page("month-{$month}", $month, page: 'collection', route: ['collection' => $month]), $months);
    }
}
