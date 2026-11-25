<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Models\Projects\Project;

/**
 * The installation's own project as projects:local-provision makes it, made on first use, for the agents a test makes.
 */
final class TestProjects
{
    public static function local(): Project
    {
        return Project::findOrCreateLocal('Journal');
    }
}
