<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use Tests\Fixtures\Reflection\Attributes\CaseMarker;

/**
 * A backed enum whose cases carry markers.
 */
enum MarkedSize: string
{
    #[CaseMarker('small')]
    case Small = 's';

    case Large = 'l';
}
