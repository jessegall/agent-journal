<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Hosts\ProjectFiles;
use App\Enums\ActorType;
use App\Enums\ProjectReadFailure;
use App\Enums\ProjectReadState;
use App\Enums\ProjectReadType;
use App\Exceptions\CommandNotRegistered;
use App\Exceptions\ProjectReadRefused;
use App\Models\Agents\Agent;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectRead;
use App\Support\ActorIdentity;
use App\Support\EnrolledHost;
use App\Support\ProjectReadPruning;
use App\Values\BindingFolder;
use App\Values\ChatMemberAuthority;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\ActsAsActors;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The server asks a connected project's host to read a folder or a file: the host's claim hands the read out once, to
 * that host alone, and its one report settles it after the server checks every bound again.
 */
final class ProjectReadTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = [
        'project_reads', 'project_bindings', 'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts',
        'hook_calls',
    ];

    private const string CLAIM = '/host/claim?limit=1&wait=0&watched_version=0';

    private const string SOURCE = "package main\n";

    private EnrolledHost $host;

    private ProjectBinding $binding;

    protected function setUp(): void
    {
        parent::setUp();

        $this->host = $this->enrolledHost();
        $this->binding = $this->bindingOn($this->host);
    }

    public function test_a_claim_hands_a_read_to_its_own_host_once_and_a_report_answers_it(): void
    {
        $read = $this->read(ProjectReadType::File, 'src/main.go');
        $other = $this->enrolledHost();

        $this->assertSame([], $this->hostCall($other, self::CLAIM)->assertOk()->json('project_reads'));
        $this->assertSame([$read->id], array_column($this->claim()->json('project_reads'), 'id'));
        $this->assertSame([], $this->claim()->json('project_reads'));

        $this->reportText($read)->assertNoContent();

        $answered = ProjectRead::query()->findOrFail($read->id);
        $this->assertSame(ProjectReadState::Answered, $answered->state);
        $this->assertSame(self::SOURCE, $answered->text);
        $this->assertSame(hash('sha256', self::SOURCE), $answered->digest);
    }

    public function test_a_folder_read_keeps_its_entries(): void
    {
        $read = $this->read(ProjectReadType::Directory, '');

        $this->report($read, ['entries' => [
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

        $this->hostCall($this->enrolledHost(), "/host/reports/project-reads/{$read->id}", $this->textAnswer())
            ->assertClientError();
        $this->report($folder, ['entries' => [['name' => '../x', 'is_folder' => false, 'size' => 1]]])
            ->assertClientError();
        $this->report($read, [...$this->textAnswer(), 'digest' => 'not-a-digest'])->assertClientError();

        $this->assertSame(ProjectReadState::Pending, ProjectRead::query()->findOrFail($read->id)->state);
        $this->assertSame(ProjectReadState::Pending, ProjectRead::query()->findOrFail($folder->id)->state);

        $this->reportText($read)->assertNoContent();
        $this->reportText($read)->assertClientError();
    }

    public function test_a_failure_from_the_allowlist_settles_the_read(): void
    {
        $read = $this->read(ProjectReadType::File, 'missing.txt');

        $this->report($read, ['failure' => ProjectReadFailure::Missing->value])->assertNoContent();

        $this->assertSame(ProjectReadFailure::Missing, ProjectRead::query()->findOrFail($read->id)->failure);
    }

    public function test_a_late_answer_to_an_expired_read_changes_nothing_and_pruning_removes_it_later(): void
    {
        $read = $this->read(ProjectReadType::File, 'src/main.go');
        $this->app->make(ProjectReadPruning::class)->prune(CarbonImmutable::now()->addSeconds(ProjectRead::PENDING_SECONDS_LIMIT + 1));

        $this->reportText($read)->assertNoContent();
        $this->assertSame(ProjectReadState::Expired, ProjectRead::query()->findOrFail($read->id)->state);

        $this->app->make(ProjectReadPruning::class)->prune(CarbonImmutable::now()->addMinutes(ProjectRead::KEEP_MINUTES_LIMIT + 1));
        $this->assertFalse(ProjectRead::query()->whereKey($read->id)->exists());
    }

    public function test_the_same_question_asked_again_reuses_the_recent_read(): void
    {
        $read = $this->read(ProjectReadType::File, 'src/main.go');

        $recent = ProjectRead::recentOf(
            $this->binding,
            ProjectReadType::File,
            'src/main.go',
            $this->requester(),
            CarbonImmutable::now(),
        );

        $this->assertSame($read->id, $recent->get()->id);
    }

    public function test_the_owner_gets_a_pending_read_then_the_hosts_answer_and_asking_again_reuses_it(): void
    {
        $this->ownedBy(7);
        $files = $this->app->make(ProjectFiles::class);
        $this->actAs(TestActors::user(7));

        $pending = $files->file($this->binding, 'src/main.go');
        $this->assertSame(ProjectReadState::Pending, $pending->state);

        $read = ProjectRead::query()->findOrFail($pending->readId);
        $this->reportText($read)->assertNoContent();
        $this->actAs(TestActors::user(7));

        $answered = $files->file($this->binding, 'src/main.go');
        $this->assertSame($pending->readId, $answered->readId);
        $this->assertSame(ProjectReadState::Answered, $answered->state);
        $this->assertSame(self::SOURCE, $answered->text);
    }

    public function test_a_signed_in_member_who_is_not_the_owner_may_not_read_the_project(): void
    {
        $this->ownedBy(8);
        $this->app->make(CurrentActorSetter::class)->set(TestActors::user(7), new ChatMemberAuthority('the web sign-in'));

        $this->expectException(CommandNotRegistered::class);

        $this->app->make(ProjectFiles::class)->folders($this->binding, ['']);
    }

    public function test_a_path_over_the_limit_is_refused_by_name(): void
    {
        $this->ownedBy(7);
        $this->actAs(TestActors::user(7));

        $this->expectException(ProjectReadRefused::class);

        $this->app->make(ProjectFiles::class)->file($this->binding, str_repeat('a', ProjectRead::PATH_CHARACTER_LIMIT + 1));
    }

    private function ownedBy(int $userNumber): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of($userNumber)));
    }

    private function read(ProjectReadType $type, string $path): ProjectRead
    {
        return ProjectRead::create($this->binding, $type, $path, $this->requester());
    }

    private function requester(): ActorIdentity
    {
        return new ActorIdentity(ActorType::User, '01jqzr0000000000000000user');
    }

    private function claim(): TestResponse
    {
        return $this->hostCall($this->host, self::CLAIM)->assertOk();
    }

    private function reportText(ProjectRead $read): TestResponse
    {
        return $this->report($read, $this->textAnswer());
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
    private function report(ProjectRead $read, array $answer): TestResponse
    {
        return $this->hostCall($this->host, "/host/reports/project-reads/{$read->id}", $answer);
    }

    private function bindingOn(EnrolledHost $host): ProjectBinding
    {
        $project = Project::create('shop', 'Shop');

        return ProjectBinding::create(
            Host::query()->findOrFail($host->hostId),
            $project,
            Environment::openDefaultOf($project),
            Agent::create('Shop main agent', 'main-agent'),
            new BindingFolder('root-'.Str::random(6), '/Users/owner/shop', 'Owner laptop', Str::random(16)),
        );
    }
}
