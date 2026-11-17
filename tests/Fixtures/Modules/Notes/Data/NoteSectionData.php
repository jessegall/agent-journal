<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Data;

use Spatie\LaravelData\Data;

/**
 * How many notes the calling actor has, beside the chosen agent session in Chat's dock.
 */
final class NoteSectionData extends Data
{
    public function __construct(public readonly int $count) {}
}
