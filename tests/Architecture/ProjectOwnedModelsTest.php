<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Models\Agents\Agent;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\InstallAttempt;
use App\Models\Projects\ProjectInvitation;
use App\Models\Support\BelongsToProject;
use App\Models\Support\BelongsToProjectOrGlobal;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ProjectModels;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The one proof of project reads: every model whose table names a project reads through the project scope, the scope
 * is lifted only by the two traits' named reads, and the journal's read across every project stays on a short list.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class ProjectOwnedModelsTest extends TestCase
{
    use RefreshHookDatabase;

    private const string TRAIT_ADVICE = 'Give each of these models BelongsToProject, or BelongsToProjectOrGlobal for a '
        .'record that may be Global, so its reads follow the project selection.';

    private const string LIFT_ADVICE = 'Lift the project scope only through acrossProjects() or inProject().';

    private const string ACROSS_ADVICE = 'Read one project with inProject(), or add the caller here with its reason.';

    /**
     * The models whose table names a project and that read every project on purpose, each with its reason.
     */
    private const array UNSCOPED = [
        Agent::class => 'agent lists choose their agents with inSelection, and a call finds its own agent by id',
        ConnectionAudit::class => 'an installation row of connecting folders, shared by every project (doc 129)',
        InstallAttempt::class => 'an installation row of connecting folders, shared by every project (doc 129)',
        ProjectInvitation::class => 'an installation row of connecting folders, shared by every project (doc 129)',
    ];

    /**
     * The files that call acrossProjects(), each with its reason; none reads across projects today.
     */
    private const array ACROSS_PROJECTS_CALLERS = [];

    /**
     * The files the scope is lifted in by name.
     */
    private const array SCOPE_LIFTERS = ['app/Models/Support/BelongsToProject.php'];

    public function test_every_model_whose_table_names_a_project_reads_through_the_project_scope(): void
    {
        $unscoped = [];

        foreach (ProjectModels::all() as $model) {
            $table = new $model()->getTable();

            if (! Schema::hasColumn($table, 'project_id') || array_key_exists($model, self::UNSCOPED)) {
                continue;
            }

            $traits = class_uses_recursive($model);

            if (! in_array(BelongsToProject::class, $traits, true)
                && ! in_array(BelongsToProjectOrGlobal::class, $traits, true)) {
                $unscoped[] = $model;
            }
        }

        $this->assertSame([], $unscoped, self::TRAIT_ADVICE);
    }

    public function test_the_project_scope_is_lifted_only_by_the_traits_named_reads(): void
    {
        $this->assertSame(
            [],
            $this->filesMatching('/withoutGlobalScope\(\s*ProjectScope::class\s*\)/', self::SCOPE_LIFTERS),
            self::LIFT_ADVICE,
        );
    }

    public function test_only_the_listed_callers_read_across_projects(): void
    {
        $this->assertSame(
            [],
            $this->filesMatching('/->acrossProjects\(\)/', array_keys(self::ACROSS_PROJECTS_CALLERS)),
            self::ACROSS_ADVICE,
        );
    }

    /**
     * The application and domain files, by their path from the project root, whose text matches, except those allowed.
     *
     * @param  list<string>  $allowed
     * @return list<string>
     */
    private function filesMatching(string $pattern, array $allowed): array
    {
        $found = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode()]) as $file) {
            $path = substr($file, strlen(base_path()) + 1);

            if (! in_array($path, $allowed, true) && preg_match($pattern, (string) file_get_contents($file)) === 1) {
                $found[] = $path;
            }
        }

        return $found;
    }
}
