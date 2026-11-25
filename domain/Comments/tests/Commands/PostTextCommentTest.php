<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Enums\Projects\ProjectReadType;
use App\Exceptions\InvalidTextRange;
use App\Exceptions\TargetHasNoText;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectFile;
use App\Models\Projects\ProjectFileVersion;
use App\Models\Projects\ProjectRead;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\EnrolledHost;
use App\Support\ProjectReadRetentionService;
use App\Support\RecordIdentity;
use App\Values\BindingFolder;
use App\Values\TextRange;
use Carbon\CarbonImmutable;
use Domain\Comments\Commands\PostTextComment\PostTextCommentCommand;
use Domain\Comments\Models\Comment;
use Domain\Comments\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;

/**
 * A reader comments on lines of a record's text: the comment is anchored to those lines of the version read, and a
 * record without text refuses a comment that points at text and keeps none.
 */
final class PostTextCommentTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;

    private const array TABLES = [
        'comments',
        'users',
        'agents',
        'agent_sessions',
        'inboxes',
        'inbox_members',
        'number_groups',
        'command_receipts',
        'project_file_versions',
        'project_files',
        'project_reads',
        'project_bindings',
        'project_environments',
        'projects',
        'agent_runtimes',
        'hosts',
        'hook_calls',
    ];

    private EnrolledHost $host;

    private ProjectBinding $binding;

    private const string PATH = 'src/main.go';

    private const string SOURCE = "package main\n\nfunc main() {}\n";

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();
        $this->installNotesModule();
        $this->journal->agent('Writer', 'read-only-helper')->owner();
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_a_comment_on_lines_is_anchored_to_those_lines_of_the_version_read(): void
    {
        $page = NotePage::written("# Plan\nFirst line.\nSecond line.\n");
        $target = new RecordIdentity(NotePage::linkType(), $page->id);

        $commentId = $this->journal->run(
            new PostTextCommentCommand($target, 'Which lines?', TextRange::lines('1', 2, 3), (string) Str::uuid()),
        );

        $comment = Comment::query()->findOrFail($commentId);
        $this->assertSame('Which lines?', $comment->body);
        $this->assertSame([2, 3], [$comment->first_line, $comment->last_line]);
    }

    public function test_a_record_without_text_refuses_a_comment_on_text_and_keeps_none(): void
    {
        $note = new Note(['text' => 'Check the lock order']);
        $note->saveFor($this->journal->agentCalled('Writer')->id);
        $target = new RecordIdentity(Note::linkType(), $note->id);

        $this->assertThrows(
            fn () => $this->journal->run(
                new PostTextCommentCommand($target, 'Which line?', TextRange::lines('1', 1, 1), (string) Str::uuid()),
            ),
            TargetHasNoText::class,
        );
        $this->assertSame(0, Comment::query()->count());
    }

    public function test_a_comment_on_lines_of_a_version_is_checked_against_that_text(): void
    {
        $this->host = $this->journal->enrolledHost();
        $project = Project::create('shop', 'Shop');
        $this->binding = ProjectBinding::create(
            Host::query()->findOrFail($this->host->hostId),
            $project,
            Environment::createForDefault($project),
            Agent::create('Shop main agent', 'main-agent', $project),
            new BindingFolder('root-'.Str::random(6), '/Users/owner/shop', 'Owner laptop', Str::random(16)),
        );

        $this->notifyWhole(self::SOURCE);
        $this->actAsOwner();
        $target = $this->target();
        $digest = hash('sha256', self::SOURCE);

        $this->bus()->run(
            new PostTextCommentCommand($target, 'Why empty?', TextRange::lines($digest, 3, 3), (string) Str::uuid()),
        );

        $this->assertSame([$digest], Comment::query()->pluck('version_id')->all());

        $this->expectException(InvalidTextRange::class);
        $this->bus()->run(
            new PostTextCommentCommand($target, 'Past the end', TextRange::lines($digest, 9, 9), (string) Str::uuid()),
        );
    }

    public function test_a_version_a_comment_names_is_kept_while_the_oldest_unnamed_ones_go(): void
    {
        $this->host = $this->journal->enrolledHost();
        $project = Project::create('shop', 'Shop');
        $this->binding = ProjectBinding::create(
            Host::query()->findOrFail($this->host->hostId),
            $project,
            Environment::createForDefault($project),
            Agent::create('Shop main agent', 'main-agent', $project),
            new BindingFolder('root-'.Str::random(6), '/Users/owner/shop', 'Owner laptop', Str::random(16)),
        );

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
            ActorIdentity::ofClass(User::class, '01jqzr0000000000000000user'),
        );

        $this->journal->hostCall($this->host, 'POST', "/host/reports/project-reads/{$read->id}", [
            'text' => $text,
            'digest' => hash('sha256', $text),
            'size' => strlen($text),
            'truncated' => $isTruncated,
        ])->assertNoContent();
    }

    private function actAsOwner(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->journal->actAsUserId($owner->id);
    }

    private function target(): RecordIdentity
    {
        return new RecordIdentity(
            ProjectFile::linkType(),
            ProjectFile::query()->where('path', self::PATH)->firstOrFail()->id,
        );
    }
}
