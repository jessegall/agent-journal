<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Declarations\SlotContext;
use Spatie\LaravelData\Data;

/**
 * Reads the data of one section for the slot it is shown in. An implementation narrows the return type to its
 * concrete Data class and checks the context's id again through the code that owns it.
 */
interface SectionResolver
{
    public function read(SlotContext $context): Data;
}
