<?php

declare(strict_types=1);

namespace App\Support\Views;

use App\Data\LayoutData;
use App\Models\Layout;

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
            ->orderBy('name')
            ->readAll('the layout picker lists every layout of the user')
            ->get()
            ->map(
                fn (Layout $layout) => LayoutData::from(
                    ['id' => (string) $layout->id, 'name' => $layout->name, 'shape' => $layout->shape],
                ),
            )
            ->all());
    }
}
