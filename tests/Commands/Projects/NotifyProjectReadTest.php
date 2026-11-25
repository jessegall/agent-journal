<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Enums\Projects\ProjectReadFailure;
use App\Enums\Projects\ProjectReadStatus;
use App\Enums\Projects\ProjectReadType;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectRead;
use App\Support\ActorIdentity;
use App\Support\EnrolledHost;
use App\Support\ProjectReadRetentionService;
use App\Values\BindingFolder;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A host reports a read: a folder read keeps its entries, another host's, a repeated or an out-of-bounds report changes
 * nothing, a failure from the allowlist settles the read, and a late answer to an expired read changes nothing.
 */
final class NotifyProjectReadTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'project_reads', 'project_bindings', 'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts',
        'hook_calls',
    ];

    private const string SOURCE = "package main\n";

    private EnrolledHost $host;

    private ProjectBinding $binding;

    protected function setUp(): void
    {
        parent::setUp();

        $this->host = $this->journal->enrolledHost();
        $this->binding = $this->bindingOn($this->host);
    }

    public function test_a_folder_read_keeps_its_entries(): void
    {
        $read = $this->read(ProjectReadType::Directory, '');

        $this->notify($read, ['entries' => [
            ['name' => 'src', 'is_folder' => true, 'size' => 0],
            ['name' => 'README.md', 'is_folder' => false, 'size' => 6],
        ]])->assertNoContent();

        $entries = ProjectRead::query()->findOrFail($read->id)->listedEntries();
        $this->assertSame(['src', 'README.md'], array_column($entries, 'name'));
    }

    public function test_another_hosts_report_a_repeated_one_and_an_out_of_bounds_one_change_nothing(): void
    {
        $read = $this->read(ProjectReadType::File, 'src/main.go');
        $folder = $this->read(ProjectReadType::Directory, 'src');

        $this->journal->hostCall(
            $this->journal->enrolledHost(),
            'POST',
            "/host/reports/project-reads/{$read->id}",
            $this->textAnswer(),
        )
            ->assertClientError();
        $this->notify($folder, ['entries' => [['name' => '../x', 'is_folder' => false, 'size' => 1]]])
            ->assertClientError();
        $this->notify($read, [...$this->textAnswer(), 'digest' => 'not-a-digest'])->assertClientError();

        $this->assertSame(ProjectReadStatus::Pending, ProjectRead::query()->findOrFail($read->id)->status);
        $this->assertSame(ProjectReadStatus::Pending, ProjectRead::query()->findOrFail($folder->id)->status);

        $this->reportText($read)->assertNoContent();
        $this->reportText($read)->assertClientError();
    }

    public function test_a_failure_from_the_allowlist_settles_the_read(): void
    {
        $read = $this->read(ProjectReadType::File, 'missing.txt');

        $this->notify($read, ['failure' => ProjectReadFailure::Missing->value])->assertNoContent();

        $this->assertSame(ProjectReadFailure::Missing, ProjectRead::query()->findOrFail($read->id)->failure);
    }

    public function test_a_late_answer_to_an_expired_read_changes_nothing_and_pruning_removes_it_later(): void
    {
        $read = $this->read(ProjectReadType::File, 'src/main.go');
        $this->app->make(ProjectReadRetentionService::class)->prune(
            CarbonImmutable::now()->addSeconds(ProjectRead::PENDING_SECONDS_LIMIT + 1),
        );

        $this->reportText($read)->assertNoContent();
        $this->assertSame(ProjectReadStatus::Expired, ProjectRead::query()->findOrFail($read->id)->status);

        $this->app->make(ProjectReadRetentionService::class)->prune(
            CarbonImmutable::now()->addMinutes(ProjectRead::KEEP_MINUTES_LIMIT + 1),
        );
        $this->assertFalse(ProjectRead::query()->whereKey($read->id)->exists());
    }

    private function read(ProjectReadType $type, string $path): ProjectRead
    {
        return ProjectRead::create($this->binding, $type, $path, $this->requester());
    }

    private function requester(): ActorIdentity
    {
        return ActorIdentity::ofClass(User::class, '01jqzr0000000000000000user');
    }

    private function reportText(ProjectRead $read): TestResponse
    {
        return $this->notify($read, $this->textAnswer());
    }

    /**
     * @return array<string, mixed>
     */
    private function textAnswer(): array
    {
        return ['text' => self::SOURCE, 'digest' => hash('sha256', self::SOURCE), 'size' => strlen(self::SOURCE)];
    }

    /**
     * @param  array<string, mixed>  $answer
     */
    private function notify(ProjectRead $read, array $answer): TestResponse
    {
        return $this->journal->hostCall($this->host, 'POST', "/host/reports/project-reads/{$read->id}", $answer);
    }

    private function bindingOn(EnrolledHost $host): ProjectBinding
    {
        $project = Project::create('shop', 'Shop');

        return ProjectBinding::create(
            Host::query()->findOrFail($host->hostId),
            $project,
            Environment::createForDefault($project),
            Agent::create('Shop main agent', 'main-agent', $project),
            new BindingFolder('root-'.Str::random(6), '/Users/owner/shop', 'Owner laptop', Str::random(16)),
        );
    }
}
