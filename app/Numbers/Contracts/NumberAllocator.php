<?php

declare(strict_types=1);

namespace App\Numbers\Contracts;

use Illuminate\Database\Eloquent\Model;

/**
 * Gives a record about to be created the next number of its group.
 */
interface NumberAllocator
{
    public function allocate(Model&Numbered $record): void;
}
