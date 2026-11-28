<?php

declare(strict_types=1);

namespace App\Support\Views;

use App\Data\Pages\LayoutData;
use App\Models\Records\Layout;

/**
 * The signed-in user's saved layouts for the layouts menu, by name.
 */
final readonly class SavedLayouts
{
    /**
     * @param list<string> $panes
     * @return list<LayoutData>
     */
    public function layouts(array $panes): array
    {
        return array_values(Layout::query()
            ->byName()
            ->get()
            ->map(
                fn (Layout $layout) => LayoutData::from(
                    ['id' => (string) $layout->id, 'name' => $layout->name, 'shape' => $layout->shape->keepingWindows($panes)],
                ),
            )
            ->all());
    }
}
