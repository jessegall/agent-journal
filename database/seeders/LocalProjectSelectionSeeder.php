<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Projects\Project;
use App\Projects\CurrentProject;
use App\Values\ProjectSelection;
use Closure;
use Illuminate\Database\Seeder;

/**
 * Runs the given seeding with the local project selected, so the sample records it makes belong to that project and
 * read back in it, as a console run selects none.
 */
final class LocalProjectSelectionSeeder extends Seeder
{
    /**
     * @param  Closure(): void  $seeding
     */
    public function run(CurrentProject $projects, Closure $seeding): void
    {
        $projects->within(ProjectSelection::of(Project::findLocal()->id), $seeding);
    }
}
