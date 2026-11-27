<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

/**
 * The reads of owned rows for whoever acts in this request, through the visibility provider of the actor's type.
 */
interface ActorVisibility extends ActorVisibilityProvider
{
    /**
     * Whether the acting actor may read every owner's rows, so a page offers only the reads that would be allowed.
     */
    public function canReadAcrossOwners(): bool;
}
