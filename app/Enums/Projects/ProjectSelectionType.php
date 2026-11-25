<?php

declare(strict_types=1);

namespace App\Enums\Projects;

/**
 * Which records a request reads: every project's, one project's, or only Global ones.
 */
enum ProjectSelectionType: string
{
    case All = 'all';
    case Project = 'project';
    case None = 'none';
}
