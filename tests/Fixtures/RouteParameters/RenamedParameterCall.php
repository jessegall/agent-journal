<?php

declare(strict_types=1);

namespace Tests\Fixtures\RouteParameters;

/**
 * A fixture caller that still names a route's parameter by its old name, which RouteParametersTest names.
 */
final readonly class RenamedParameterCall
{
    public function address(): string
    {
        return route('profiles.account-host.folders.answer', ['order' => 'instruction-1']);
    }
}
