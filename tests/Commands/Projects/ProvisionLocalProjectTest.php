<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\ProvisionLocalProject\ProvisionLocalProjectCommand;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Messages\InboxPermission;
use App\Models\Access\EnvironmentUserGrant;
use App\Models\Access\User;
use App\Models\Projects\Environment;
use App\Models\Projects\Project;
use App\Support\EntryDispatchers;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The journal provisions the installation's own project: one project of the key, its Main environment and the owner's
 * grant of every permission on that environment's real id; provisioning again makes nothing twice.
 */
final class ProvisionLocalProjectTest extends TestCase
{
    use RefreshHookDatabase;

    private const string KEY = 'journal';

    private const string LABEL = 'Journal';

    public function test_it_makes_the_project_its_main_environment_and_the_owners_grant_on_its_real_id(): void
    {
        $owner = User::factory()->create();

        $this->provision($owner);

        $project = Project::query()->withKey(self::KEY)->sole();
        $environment = Environment::query()->where('project_id', $project->id)->sole();
        $grant = EnvironmentUserGrant::query()->where('user_id', $owner->id)->sole();
        $this->assertSame(self::LABEL, $project->label);
        $this->assertSame(Environment::DEFAULT_LABEL, $environment->label);
        $this->assertSame($environment->id, $grant->environment_key);

        foreach (InboxPermission::cases() as $permission) {
            $this->assertTrue($grant->allows($permission), $permission->value);
        }
    }

    public function test_provisioning_again_makes_nothing_twice(): void
    {
        $owner = User::factory()->create();

        $this->provision($owner);
        $this->provision($owner);

        $this->assertSame(1, Project::query()->count());
        $this->assertSame(1, Environment::query()->count());
        $this->assertSame(1, EnvironmentUserGrant::query()->count());
    }

    private function provision(User $owner): void
    {
        $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'projects local-provision',
            new ProvisionLocalProjectCommand($owner->id, self::KEY, self::LABEL),
        );
    }
}
