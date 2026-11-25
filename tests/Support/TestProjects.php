<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Models\Projects\Project;
use Illuminate\Container\Container;

/**
 * The installation's own project as projects:local-provision makes it, made on first use, for the agents a test makes.
 */
final class TestProjects
{
    public static function local(): Project
    {
        $key = Container::getInstance()->make('config')->string('processes.project_key');
        $project = Project::query()->withKey($key)->first();

        if ($project !== null) {
            return $project;
        }

        return Project::create($key, 'Journal');
    }
}
