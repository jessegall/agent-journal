<?php

declare(strict_types=1);

namespace App\Observers;

use App\Contracts\Records\Numbered;
use App\Support\LockingNumberAllocator;
use Illuminate\Database\Eloquent\Model;

/**
 * Hands a numbered record to the allocator as it is created, and never after.
 */
final readonly class NumberObserver
{
    public function __construct(private LockingNumberAllocator $allocator) {}

    public function creating(Model&Numbered $record): void
    {
        $this->allocator->allocate($record);
    }
}
