<?php

declare(strict_types=1);

namespace App\Ui\Contracts;

use App\Ui\Data\SlotSectionData;

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
