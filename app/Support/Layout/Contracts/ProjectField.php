<?php

declare(strict_types=1);

namespace App\Support\Layout\Contracts;

use App\Support\Layout\LayoutPartData;

/**
 * The project field of a creation dialog, offering the projects the viewer may create in.
 */
interface ProjectField
{
    /**
     * The field of a dialog whose record belongs to one project; none within a selection of one.
     *
     * @return list<LayoutPartData>
     */
    public function forProject(): array;

    /**
     * The field of a dialog whose record may also be Global, which is offered after the projects.
     *
     * @return list<LayoutPartData>
     */
    public function forProjectOrGlobal(): array;
}
