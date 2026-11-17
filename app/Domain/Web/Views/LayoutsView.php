<?php

declare(strict_types=1);

namespace App\Domain\Web\Views;

use App\Domain\Web\Data\LayoutData;
use App\Domain\Web\Models\Layout;

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
        return array_values(Layout::query()->orderBy('name')->get()
            ->map(fn (Layout $layout) => LayoutData::from(['id' => (string) $layout->id, 'name' => $layout->name, 'shape' => $layout->shape]))
            ->all());
    }
}
