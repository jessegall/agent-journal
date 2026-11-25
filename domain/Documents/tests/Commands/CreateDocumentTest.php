<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Files\Files;
use App\Contracts\Records\RecordResolver;
use App\Exceptions\CommandInputInvalid;
use App\Exceptions\ContentMissing;
use App\Exceptions\FileMissing;
use App\Exceptions\RecordUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Messages\Message;
use App\Models\Records\Link;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use App\Support\ReflectedMethod;
use App\Support\ReflectedParameter;
use App\Support\ReflectedType;
use App\Support\SignedCall;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Console\Concerns\ReadsRecordBody;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Events\DocumentCreated;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\Report;
use Domain\Documents\Tests\TestCase;
use Domain\Plans\PlansDomain;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;

/**
 * A user or agent files a document: documents are numbered from one, each at its first revision that never changes,
 * the title and abstract are kept trimmed, and an empty title, a two-line abstract or too many links leave no row and
 * name the field.
 */
final class CreateDocumentTest extends TestCase
{
    use CommitsHookRows;

    private const string GOAL_TEXT = <<<'TEXT'
        # Goal
        Ship it.

        TEXT;

    private const string FIRST_DOCUMENT = 'doc 1';

    private const string SECOND_DOCUMENT = 'doc 2';

    private const string TITLE_REQUIRED = 'title: The title field is required.';

    private const string ABSTRACT_ONE_LINE = 'abstract: The abstract must be one line';

    private const string TOO_MANY_RELATED = 'relatedRecords: '
        .'The related records field must not have more than 50 items.';

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
        'document_closes',
        'document_drafts',
        'links',
        'messages',
        'tasks',
        'phases',
        'plans',
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
        'users',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_documents_are_numbered_and_each_starts_at_revision_one(): void
    {
        $first = $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', self::GOAL_TEXT));

        $second = $this->bus()->run(new CreateDocumentCommand('Notes', 'What we saw', "Text\n"));

        $this->assertSame(self::FIRST_DOCUMENT, $first->label());
        $this->assertSame(self::SECOND_DOCUMENT, $second->label());
        $this->assertSame(['1'], [$this->app->make(DocumentResolver::class)->show(2)->revision]);

        $this->assertSame(self::GOAL_TEXT, $this->app->make(DocumentResolver::class)->show(1)->body);
    }

    public function test_an_empty_title_leaves_no_row_and_names_the_field(): void
    {
        $this->assertThrows(
            fn () => $this->bus()->run(new CreateDocumentCommand(' ', 'What we build', "Text\n")),
            CommandInputInvalid::class,
            self::TITLE_REQUIRED,
        );

        $this->assertSame(0, Document::query()->count());
    }

    public function test_a_two_line_abstract_or_too_many_links_leaves_no_row_and_names_the_field(): void
    {
        $about = array_map(
            fn (int $number) => new RecordIdentity('tasks.task', TestIds::of($number)),
            range(1, CreateDocumentCommand::MOST_LINKS + 1),
        );

        $this->assertThrows(
            fn () => $this->bus()->run(new CreateDocumentCommand('Design', "What we\nbuild", "Text\n")),
            CommandInputInvalid::class,
            self::ABSTRACT_ONE_LINE,
        );

        $this->assertThrows(
            fn () => $this->bus()->run(new CreateReportCommand('Check', 'What we found', "Text\n", $about)),
            CommandInputInvalid::class,
            self::TOO_MANY_RELATED,
        );

        $this->assertSame(0, Document::query()->count() + Report::query()->count());
    }

    public function test_a_title_and_abstract_are_stored_trimmed(): void
    {
        $this->bus()->run(new CreateDocumentCommand('  Plan for May  ', ' What we build ', "Text\n"));
        $this->bus()->run(new CreateReportCommand('  Plan for May  ', ' What we found ', "Text\n"));

        $document = $this->app->make(DocumentResolver::class)->show(1);

        $this->assertSame([
            'Plan for May',
            'What we build',
        ], [
            $document->title,
            $document->abstract,
        ]);

        $this->assertSame([
            'Plan for May',
            'What we found',
        ], [
            Report::query()->sole()->title,
            Report::query()->sole()->abstract,
        ]);
    }

    public function test_a_saved_revision_does_not_change(): void
    {
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "Text\n"));
        $revision = DocumentRevision::query()->sole();

        $this->expectException(RecordImmutable::class);

        $revision->forceFill(['body' => 'changed'])->save();
    }

    public function test_no_create_command_takes_an_author(): void
    {
        foreach ([CreateDocumentCommand::class] as $command) {
            $parameters = array_map(
                fn (ReflectedParameter $parameter) => $parameter->name(),
                ReflectedType::of($command)->constructor()
                    ->map(fn (ReflectedMethod $constructor) => $constructor->parameters())
                    ->getOrElse([]),
            );

            $this->assertSame(
                [],
                array_values(
                    array_filter($parameters, fn (string $name) => preg_match('/author|creator|actor/i', $name) === 1),
                ),
            );
        }

        $this->journal->actAsUserId(TestIds::of(3));
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "Text\n"));
        $this->assertSame(TestIds::of(3), DocumentRevision::query()->sole()->author_id);
    }

    public function test_a_failed_create_leaves_no_record_and_raises_no_event(): void
    {
        $this->journal->actAsUserId(TestIds::of(1));
        $announced = [];

        $this->app->make(Dispatcher::class)->listen(DocumentCreated::class, function (
            DocumentCreated $event,
        ) use (&$announced): void {
            $announced[] = $event->number;
        });

        try {
            $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "   \n"));
            $this->fail('An empty body was accepted.');
        } catch (ContentMissing) {
            $this->assertSame([
                0,
                0,
                [],
            ], [
                Document::query()->count(),
                DocumentRevision::query()->count(),
                $announced,
            ]);
        }
    }

    public function test_doc_make_about_a_task_links_it_and_a_private_or_extra_target_creates_nothing(): void
    {
        $this->actAsUser();

        Task::factory()->create(['title' => 'Write the client']);
        $task = $this->records()->identify(RecordReference::parse('task 1'));

        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "Text\n", [$task]));
        $this->assertSame(1, Link::query()->count());

        $message = $this->messageFor(8);
        $this->actAsAgent(9);

        try {
            $about = [new RecordIdentity(Message::linkType(), $message->id)];
            $this->bus()->run(new CreateDocumentCommand('Leak', 'Should not exist', "Text\n", $about));
            $this->fail('A document about a private message was created.');
        } catch (RecordUnavailable) {
            $this->assertSame(1, Document::query()->count());
        }

        $this->expectException(CommandInputInvalid::class);
        $this->bus()->run(new CreateDocumentCommand('Many', 'Too many links', "Text\n", array_fill(0, 51, $task)));
    }

    public function test_a_missing_body_file_fails_with_its_own_reason(): void
    {
        $this->app->make(Kernel::class)->registerCommand(new class extends Command
        {
            use ReadsRecordBody;

            protected $signature = 'test:record-body {--body=} {--file=}';

            public function handle(Files $files): int
            {
                $this->bodyText($files);

                return self::SUCCESS;
            }
        });

        $this->expectException(FileMissing::class);

        $this->artisan('test:record-body', ['--file' => sys_get_temp_dir().'/no-such-notes.md'])->run();
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }

    private function records(): RecordResolver
    {
        return $this->app->make(RecordResolver::class);
    }

    private function actAsAgent(int $agent): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of($agent)),
            TestStartAuthority::forAgent(TestIds::of($agent)),
        );
        $call = new SignedCall(TestIds::of(500 + $agent), CarbonImmutable::now(), str_repeat('0', 64));
        $context = new AgentContext(TestIds::of($agent), TestIds::of($agent * 10), $call, null);
        $this->app->instance(AgentContext::class, $context);
    }

    private function actAsUser(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            TestActors::user(1),
            new OwnerAuthority('test'),
        );
    }

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class, PlansDomain::class, TasksDomain::class);
    }

    private function messageFor(int $agent): Message
    {
        $inbox = $this->journal->inboxes()->personal(TestActors::agentIdentity($agent));

        return $this->journal->inboxes()->post(
            $inbox,
            Agent::create('Sender', 'main-agent', $this->localProject()),
            "Private plan\nDetails.",
        );
    }
}
