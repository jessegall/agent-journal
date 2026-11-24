<?php

declare(strict_types=1);

namespace App\Contracts\Records;

use App\Values\ReadOrder;

/**
 * A model whose plain reads are bounded: how many rows a plain read returns and in which order.
 */
interface ReadableModel
{
    /**
     * The most rows a read of the model returns when it names no limit.
     */
    public function defaultReadLimit(): int;

    /**
     * The order rows of the model are read in when a read names none.
     */
    public function defaultReadOrder(): ReadOrder;
}
