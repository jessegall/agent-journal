<?php

declare(strict_types=1);

namespace App\Console\Concerns;

use App\Models\Projects\Project;

/**
 * The project a command's --project option names by its key, or the local project when the option is left out.
 */
trait ReadsProjectOption
{
    private function project(): Project
    {
        $key = $this->option('project');

        if (! is_string($key)) {
            return Project::findLocal();
        }

        return Project::findForKey($key);
    }
}
