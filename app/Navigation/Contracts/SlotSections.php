<?php

declare(strict_types=1);

namespace App\Navigation\Contracts;

use App\Navigation\Data\Pages\SlotSectionData;

/**
 * The sections the domains put in one slot of a page, each by the prop that carries it and its component.
 */
interface SlotSections
{
    /**
     * @return list<SlotSectionData>
     */
    public function sectionsIn(string $page, string $slot): array;
}
