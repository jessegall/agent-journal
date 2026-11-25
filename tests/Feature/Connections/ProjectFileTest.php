<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Commands\Comments\PostTextComment\PostTextCommentCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Enums\Assignments\ActorType;
use App\Enums\Projects\ProjectReadType;
use App\Exceptions\InvalidTextRange;
use App\Exceptions\RecordUnavailable;
use App\Models\Agents\Agent;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectFile;
use App\Models\Projects\ProjectFileVersion;
use App\Models\Projects\ProjectRead;
use App\Models\Records\Comment;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\EnrolledHost;
use App\Support\ProjectReadRetentionService;
use App\Support\RecordIdentity;
use App\Values\BindingFolder;
use App\Values\InboxMemberAuthority;
use App\Values\TextRange;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A file its host read whole is kept as a version once per digest, and a comment on a range of its lines is checked
 * against exactly that version's text, which is kept for as long as the comment names it.
 */
final class ProjectFileTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use SendsHostCalls;
    use StartsAgentRequests;

    private const array TABLES = [
        'comments', 'project_file_versions', 'project_files', 'number_groups', 'project_reads', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts', 'hook_calls', 'users',
    ];

    private const string PATH = 'src/main.go';

    private const string SOURCE = "package main\n\nfunc main() {}\n";

    private EnrolledHost $host;

    private ProjectBinding $binding;

    protected function setUp(): void
    {
        parent::setUp();

        $this->host = $this->enrolledHost();
        $project = Project::create('shop', 'Shop');
        $this->binding = ProjectBinding::create(
            Host::query()->findOrFail($this->host->hostId),
            $project,
            Environment::createForDefault($project),
            Agent::create('Shop main agent', 'main-agent'),
            new BindingFolder('root-'.Str::random(6), '/Users/owner/shop', 'Owner laptop', Str::random(16)),
        );
    }

    public function test_a_file_read_whole_is_kept_once_per_digest_and_a_cut_one_is_not(): void
    {
        $this->notifyWhole(self::SOURCE);
        $this->notifyWhole(self::SOURCE);
        $this->notify('cut text', true);

        $file = ProjectFile::query()->where('path', self::PATH)->firstOrFail();
        $this->assertSame([hash('sha256', self::SOURCE)], $file->versions()->pluck('digest')->all());
        $this->assertSame(4, $file->versions()->firstOrFail()->line_count);
    }

    public function test_a_comment_on_lines_of_a_version_is_checked_against_that_text(): void
    {
        $this->notifyWhole(self::SOURCE);
        $this->actAsOwner();
        $target = $this->target();
        $digest = hash('sha256', self::SOURCE);

        $this->bus()->run(new PostTextCommentCommand($target, 'Why empty?', TextRange::lines($digest, 3, 3), (string) Str::uuid()));

        $this->assertSame([$digest], Comment::query()->pluck('version_id')->all());

        $this->expectException(InvalidTextRange::class);
        $this->bus()->run(new PostTextCommentCommand($target, 'Past the end', TextRange::lines($digest, 9, 9), (string) Str::uuid()));
    }

    public function test_a_version_a_comment_names_is_kept_while_the_oldest_unnamed_ones_go(): void
    {
        $this->notifyWhole('first');
        $this->actAsOwner();
        $this->bus()->run(new PostTextCommentCommand(
            $this->target(),
            'Keep this one.',
            TextRange::lines(hash('sha256', 'first'), 1, 1),
            (string) Str::uuid(),
        ));

        foreach (['second', 'third', 'fourth', 'fifth'] as $minutes => $text) {
            CarbonImmutable::setTestNow(CarbonImmutable::now()->addMinutes($minutes + 1));
            $this->notifyWhole($text);
        }

        $this->app->make(ProjectReadRetentionService::class)->prune(CarbonImmutable::now());

        $kept = ProjectFileVersion::query()->pluck('text')->all();
        sort($kept);
        $this->assertSame(['fifth', 'first', 'fourth', 'third'], $kept);
    }

    public function test_someone_other_than_the_owner_may_not_read_a_file(): void
    {
        $this->notifyWhole(self::SOURCE);
        $this->app->instance(AccessSettings::class, new AccessSettings(User::factory()->create()->id));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(User::factory()->create()->id),
            new InboxMemberAuthority('the web sign-in'),
        );

        $this->expectException(RecordUnavailable::class);

        $this->app->make(RecordResolver::class)->requireReadable($this->target());
    }

    private function actAsOwner(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
    }

    private function target(): RecordIdentity
    {
        return new RecordIdentity(ProjectFile::linkType(), ProjectFile::query()->where('path', self::PATH)->firstOrFail()->id);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }

    private function notifyWhole(string $text): void
    {
        $this->notify($text, false);
    }

    private function notify(string $text, bool $isTruncated): void
    {
        $read = ProjectRead::create(
            $this->binding,
            ProjectReadType::File,
            self::PATH,
            new ActorIdentity(ActorType::User, '01jqzr0000000000000000user'),
        );

        $this->hostCall($this->host, "/host/reports/project-reads/{$read->id}", [
            'text' => $text,
            'digest' => hash('sha256', $text),
            'size' => strlen($text),
            'truncated' => $isTruncated,
        ])->assertNoContent();
    }
}
