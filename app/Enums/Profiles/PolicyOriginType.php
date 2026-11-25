<?php

declare(strict_types=1);

namespace App\Enums\Profiles;

/**
 * Where an effective profile field came from: the global default of its type, the project's override of the type, or
 * the named profile's own override.
 */
enum PolicyOriginType: string
{
    case GlobalDefault = 'global_default';
    case ProjectType = 'project_type';
    case Profile = 'profile';
}
