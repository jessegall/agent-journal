<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Data\OverviewSection;

/**
 * An owner's section of the calling agent's overview, read through the owner's own readers for the caller only.
 */
interface OverviewContribution
{
    /**
     * The key of the section in the overview, such as tasks.
     */
    public function section(): string;

    public function read(): OverviewSection;
}
