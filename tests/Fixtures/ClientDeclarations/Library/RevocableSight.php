<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use App\Access\Contracts\VisibilityCheck;
use App\Actors\Contracts\Actor;

/**
 * Lets every actor see until a test revokes it in ListedNavigation.
 */
final readonly class RevocableSight implements VisibilityCheck
{
    public function __construct(private ListedNavigation $listed) {}

    public function allows(Actor $actor): bool
    {
        return ! $this->listed->isRevoked;
    }
}
