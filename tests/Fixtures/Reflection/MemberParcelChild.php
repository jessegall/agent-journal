<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use Tests\Fixtures\Reflection\Attributes\MemberMarker;

/**
 * A subclass that inherits one marked method and overrides another.
 */
final class MemberParcelChild extends MemberParcel
{
    #[MemberMarker('child')]
    public function overridden(): void {}
}
