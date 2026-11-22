<?php

declare(strict_types=1);

namespace App\Contracts\Records;

use App\Values\ReadOrder;

/**
 * A model whose plain reads are bounded: how many rows a plain read returns and in which order.
 */
interface ReadableModel
{
    public function defaultReadLimit(): int;

    public function defaultReadOrder(): ReadOrder;
}
