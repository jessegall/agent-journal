<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Actors\Contracts\Actor;
use App\Ui\Contracts\VisibilityCheck;

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
