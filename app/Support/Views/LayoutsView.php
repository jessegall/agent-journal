<?php

declare(strict_types=1);

namespace App\Support\Views;

use App\Data\Pages\LayoutData;
use App\Models\Records\Layout;

/**
 * The signed-in user's saved layouts for the layouts menu, by name.
 */
final readonly class LayoutsView
{
    /**
     * @return list<LayoutData>
     */
    public function layouts(): array
    {
        return array_values(Layout::query()
            ->byName()
            ->readAll('the layout picker lists every layout of the user')
            ->get()
            ->map(
                fn (Layout $layout) => LayoutData::from(
                    [
                        'id' => (string) $layout->id,
                        'name' => $layout->name,
                        'shape' => $layout->shape->toArray(),
                    ],
                ),
            )
            ->all());
    }
}
