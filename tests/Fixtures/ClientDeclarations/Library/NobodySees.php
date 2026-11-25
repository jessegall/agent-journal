<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use App\Contracts\Actors\Actor;
use App\Contracts\Authorization\VisibilityCheck;

final class NobodySees implements VisibilityCheck
{
    public function allows(Actor $actor): bool
    {
        return false;
    }
}
