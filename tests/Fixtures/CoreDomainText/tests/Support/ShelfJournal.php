<?php

// Core test support that arranges the Library domain's shelves, which only the domain's own fixtures may do.
use Domain\Library\Models\Shelf;

final class ShelfJournal
{
    public function shelf(): Shelf
    {
        return Shelf::create();
    }
}
