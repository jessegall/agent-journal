<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Chat\ActorDesks;
use App\Enums\ActorType;
use App\Enums\FileWindowState;
use App\Enums\ProjectReadFailure;
use App\Models\Messages\Message;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectFile;
use App\Models\Projects\ProjectFileVersion;
use App\Models\Projects\ProjectRead;
use App\Models\Records\Comment;
use App\Models\Scopes\MessageVisibility;
use App\Resolvers\FileWindowResolver;
use App\Support\ActorIdentity;
use App\Values\ProjectFileText;
use Closure;
use Domain\Access\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * The owner's File window on Home: the one file its query names, read through the project's host and shown as lines
 * with the digest of the version read.
 */
final class FileWindowTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'project_reads', 'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts',
        'project_bindings', 'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts',
        'settings_records', 'users', 'comments', 'project_file_versions', 'project_files', 'number_groups', 'messages',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    private const string README = 'README.md';

    private const string PROP = 'window_connections_file';

    public function test_a_file_waits_for_the_host_then_shows_its_lines_and_digest(): void
    {
        $this->readyFolder();
        $this->assertState(self::README, FileWindowState::Pending);

        $text = "# Shop\r\n\nhello";
        $this->readOf(self::README)->answerWithText(new ProjectFileText($text, hash('sha256', $text), 15), false);

        $this->window(self::README, fn (AssertableInertia $window) => $window
            ->where(self::PROP.'.data.state', FileWindowState::Ready->value)
            ->where(self::PROP.'.data.lines', ['# Shop', '', 'hello'])
            ->where(self::PROP.'.data.isMarkdown', true)
            ->where(self::PROP.'.data.digest', hash('sha256', $text)));
    }

    public function test_a_long_line_is_cut_and_named_and_a_file_cut_by_its_host_is_too_large(): void
    {
        $this->readyFolder();
        $this->assertState('big.txt', FileWindowState::Pending);

        $text = str_repeat('a', FileWindowResolver::LINE_CHARACTER_LIMIT + 1)."\nend";
        $this->readOf('big.txt')->answerWithText(new ProjectFileText($text, hash('sha256', $text), 900000), true);

        $this->window('big.txt', fn (AssertableInertia $window) => $window
            ->where(self::PROP.'.data.state', FileWindowState::TooLarge->value)
            ->where(self::PROP.'.data.cutLineNumbers', [1])
            ->where(self::PROP.'.data.lines.1', 'end')
            ->where(self::PROP.'.data.isTruncated', true));
    }

    public function test_a_binary_file_and_a_missing_one_are_named(): void
    {
        $this->readyFolder();
        $this->assertState('image.png', FileWindowState::Pending);
        $this->assertState('gone.txt', FileWindowState::Pending);

        $this->readOf('image.png')->fail(ProjectReadFailure::Binary);
        $this->readOf('gone.txt')->fail(ProjectReadFailure::Missing);

        $this->assertState('image.png', FileWindowState::Binary);
        $this->assertState('gone.txt', FileWindowState::Failed);
    }

    public function test_no_path_is_empty_and_no_project_is_none(): void
    {
        $this->assertState(self::README, FileWindowState::None);

        $this->readyFolder();

        $this->assertState('', FileWindowState::Empty);
    }

    public function test_a_comment_on_lines_of_the_kept_version_shows_as_its_thread_once(): void
    {
        $this->readyFolder();
        $this->assertState(self::README, FileWindowState::Pending);
        $text = "one\ntwo\nthree";
        $digest = hash('sha256', $text);
        $read = $this->readOf(self::README);
        $read->answerWithText(new ProjectFileText($text, $digest, 13), false);
        $file = ProjectFile::create($read->binding_id, self::README);
        ProjectFileVersion::create($file, $digest, $text);
        $comment = [
            'target' => "file {$file->number}",
            'body' => 'Why two?',
            'submission_key' => (string) Str::uuid(),
            'version' => $digest,
            'first_line' => 2,
            'last_line' => 2,
        ];

        $this->actingAs($this->owner)->post('/comments/post', $comment)->assertRedirect();
        $this->actingAs($this->owner)->post('/comments/post', $comment)->assertRedirect();
        $this->actingAs($this->owner)->post('/comments/post', [...$comment, 'submission_key' => (string) Str::uuid(), 'version' => str_repeat('0', 64)]);

        $this->assertSame(1, Comment::query()->count());
        $this->window(self::README, fn (AssertableInertia $window) => $window
            ->where(self::PROP.'.data.commentTarget', "file {$file->number}")
            ->where(self::PROP.'.data.threads.0.firstLine', 2)
            ->where(self::PROP.'.data.threads.0.quote', 'two')
            ->where(self::PROP.'.data.threads.0.comments.0.body', 'Why two?'));
    }

    public function test_the_projects_main_agent_is_told_once_however_often_the_message_is_sent(): void
    {
        $this->readyFolder();
        $agent = ProjectBinding::query()->firstOrFail()->main_agent_id;
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(ActorDesks::class)->provision(new ActorIdentity(ActorType::User, $this->owner->id), 'Own'),
        );
        $key = ['Idempotency-Key' => (string) Str::ulid()];
        $message = [
            'agent' => $agent,
            'path' => self::README,
            'first_line' => 2,
            'last_line' => 3,
            'comment' => 'Why two?',
        ];

        $this->actingAs($this->owner)->post('/project-connections/file-comments/tell', $message, $key)->assertSessionHasNoErrors()->assertRedirect();
        $this->actingAs($this->owner)->post('/project-connections/file-comments/tell', $message, $key)->assertRedirect();

        $this->assertSame(
            ['About README.md, lines 2 to 3: Why two?'],
            Message::query()->withoutGlobalScope(MessageVisibility::class)->pluck('body')->all(),
        );
    }

    public function test_the_project_and_a_file_read_in_one_request_each_run_their_own_read(): void
    {
        $this->readyFolder();
        $address = '/?window[connections.project][open][0]=src&window[connections.file][path]='.self::README;

        $this->actingAs($this->owner)->get($address)->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page->reloadOnly(
                [self::PROP, 'window_connections_project'],
                fn (AssertableInertia $windows) => $windows
                    ->where(self::PROP.'.data.state', FileWindowState::Pending->value)
                    ->where('window_connections_project.state', 'ready'),
            ),
        );
    }

    public function test_someone_other_than_the_owner_does_not_see_the_window(): void
    {
        $this->assertFalse($this->actingAs(User::factory()->create())->get($this->address(self::README))->isOk());
    }

    private function readyFolder(): void
    {
        $this->issueLine('the-ticket');
        $binding = (string) $this->redeemLine('the-ticket', self::NONCE)->assertCreated()->json('bindingId');
        $this->reportClaudeCode(self::NONCE, $binding);
    }

    private function readOf(string $path): ProjectRead
    {
        return ProjectRead::query()->where('path', $path)->firstOrFail();
    }

    private function assertState(string $path, FileWindowState $state): void
    {
        $this->window($path, fn (AssertableInertia $window) => $window->where(self::PROP.'.data.state', $state->value));
    }

    /**
     * @param  Closure(AssertableInertia): AssertableInertia  $assertions
     */
    private function window(string $path, Closure $assertions): void
    {
        $this->actingAs($this->owner)->get($this->address($path))->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page->reloadOnly([self::PROP], $assertions),
        );
    }

    private function address(string $path): string
    {
        return '/?window[connections.file][path]='.urlencode($path);
    }
}
