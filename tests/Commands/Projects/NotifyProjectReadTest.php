<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Hosts\EnrolledHost;
use App\Hosts\Protocol\HostProjectReadFailure;
use App\Hosts\Protocol\Payloads\HostProjectEntryPayload;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectRead;
use App\Projects\Commands\NotifyProjectRead\NotifyProjectReadCommand;
use App\Projects\Enums\ProjectReadStatus;
use App\Projects\Enums\ProjectReadType;
use App\Projects\Exceptions\ProjectReadRefused;
use App\Projects\ProjectReadRetentionService;
use App\Projects\Values\BindingFolder;
use App\Projects\Values\ProjectFileText;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A host reports a read: a folder read keeps its entries, another host's, a repeated or an out-of-bounds report changes
 * nothing, a failure from the allowlist settles the read, and a late answer to an expired read changes nothing.
 */
#[TestsCommand(NotifyProjectReadCommand::class)]
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

        $this->notify($read, entries: [
            new HostProjectEntryPayload('src', true, 0),
            new HostProjectEntryPayload('README.md', false, 6),
        ]);

        $entries = ProjectRead::query()->findOrFail($read->id)->listedEntries();
        $this->assertSame(['src', 'README.md'], array_column($entries, 'name'));
    }

    public function test_another_hosts_report_a_repeated_one_and_an_out_of_bounds_one_change_nothing(): void
    {
        $read = $this->read(ProjectReadType::File, 'src/main.go');
        $folder = $this->read(ProjectReadType::Directory, 'src');

        $other = $this->journal->enrolledHost();
        $this->assertThrows(
            fn () => $this->journal->asSystem(
                new NotifyProjectReadCommand($other->hostId, $read->id, [], $this->text(), false, null),
            ),
            ProjectReadRefused::class,
        );
        $this->assertThrows(
            fn () => $this->notify($folder, entries: [new HostProjectEntryPayload('../x', false, 1)]),
            ProjectReadRefused::class,
        );
        $this->assertThrows(
            fn () => $this->notify($read, new ProjectFileText(self::SOURCE, 'not-a-digest', strlen(self::SOURCE))),
            ProjectReadRefused::class,
        );

        $this->assertSame(ProjectReadStatus::Pending, ProjectRead::query()->findOrFail($read->id)->status);
        $this->assertSame(ProjectReadStatus::Pending, ProjectRead::query()->findOrFail($folder->id)->status);

        $this->notify($read, $this->text());
        $this->assertThrows(fn () => $this->notify($read, $this->text()), ProjectReadRefused::class);
    }

    public function test_a_failure_from_the_allowlist_settles_the_read(): void
    {
        $read = $this->read(ProjectReadType::File, 'missing.txt');

        $this->notify($read, failure: HostProjectReadFailure::Missing);

        $this->assertSame(HostProjectReadFailure::Missing, ProjectRead::query()->findOrFail($read->id)->failure);
    }

    public function test_a_late_answer_to_an_expired_read_changes_nothing_and_pruning_removes_it_later(): void
    {
        $read = $this->read(ProjectReadType::File, 'src/main.go');
        $this->app->make(ProjectReadRetentionService::class)->prune(
            CarbonImmutable::now()->addSeconds(ProjectRead::PENDING_SECONDS_LIMIT + 1),
        );

        $this->notify($read, $this->text());
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

    private function requester(): ActorReference
    {
        return ActorReference::ofClass(User::class, '01jqzr0000000000000000user');
    }

    private function text(): ProjectFileText
    {
        return new ProjectFileText(self::SOURCE, hash('sha256', self::SOURCE), strlen(self::SOURCE));
    }

    /**
     * The host's answer to the read, as the journal settles it.
     *
     * @param  list<HostProjectEntryPayload>  $entries
     */
    private function notify(
        ProjectRead $read,
        ProjectFileText|null $text = null,
        array $entries = [],
        HostProjectReadFailure|null $failure = null,
    ): void {
        $this->journal->asSystem(
            new NotifyProjectReadCommand($this->host->hostId, $read->id, $entries, $text, false, $failure),
        );
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
