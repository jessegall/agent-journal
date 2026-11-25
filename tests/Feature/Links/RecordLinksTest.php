<?php

declare(strict_types=1);

namespace Tests\Feature\Links;

use App\Commands\Links\LinkRecords\LinkRecordsCommand;
use App\Commands\Links\UnlinkRecords\UnlinkRecordsCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Exceptions\CommandInputInvalid;
use App\Exceptions\InvalidRecordIdentity;
use App\Exceptions\RecordUnavailable;
use App\Exceptions\UnknownLinkType;
use App\Models\Access\User;
use App\Models\Messages\Message;
use App\Models\Records\Link;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use App\Support\SignedCall;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * Core reads and links records of every domain through the providers their owners register, and never lets a
 * record the actor may not read show itself, not even as a missing link.
 */
final class RecordLinksTest extends TestCase
{
    use CommitsHookRows;
    use WritesInboxMessages;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'links',
        'messages',
        'tasks',
        'phases',
        'plans',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'users',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsUser();
    }

    public function test_a_task_a_plan_and_a_document_are_read_as_cards_by_their_reference(): void
    {
        Task::factory()->create(['title' => 'Write the client']);
        Plan::factory()->create(['title' => 'Version 6', 'type' => PlanType::Build]);
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "Text\n"));

        $cards = array_map(
            fn (string $reference) => $this->records()->card($this->identified($reference)),
            ['task 1', 'plan 1', 'doc 1'],
        );

        $this->assertSame(['task 1', 'plan 1', 'doc 1'], array_map(fn ($card) => $card->label, $cards));
        $this->assertSame(['Write the client', 'Version 6', 'Design'], array_map(fn ($card) => $card->title, $cards));
    }

    public function test_an_unknown_alias_and_a_class_name_are_refused_before_any_class_is_resolved(): void
    {
        try {
            $this->records()->card(new RecordIdentity('fake.thing', (string) Str::ulid()));
            $this->fail('An unknown alias was read.');
        } catch (UnknownLinkType) {
            $this->expectException(InvalidRecordIdentity::class);
        }

        new RecordIdentity('Domain\\Tasks\\Models\\Task', (string) Str::ulid());
    }

    public function test_another_agents_message_answers_exactly_like_a_missing_one(): void
    {
        $message = $this->messageFor(8);
        $this->actAsAgent(9);

        $id = (string) Str::ulid();
        $hidden = $this->refusalOf(
            fn () => $this->records()->card(new RecordIdentity(Message::linkType(), $message->id)),
        );
        $missing = $this->refusalOf(fn () => $this->records()->card(new RecordIdentity(Message::linkType(), $id)));

        $this->assertSame(str_replace($message->id, 'ID', $hidden), str_replace($id, 'ID', $missing));
        $this->assertSame([], $this->records()->visibleCards([new RecordIdentity(Message::linkType(), $message->id)]));
    }

    public function test_a_report_links_to_a_plan_and_a_document_once_and_unlinking_keeps_both_records(): void
    {
        Plan::factory()->create(['title' => 'Version 6', 'type' => PlanType::Build]);
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "Text\n"));
        $this->bus()->run(new CreateReportCommand('Check', 'What we found', "All good\n"));
        [$report, $plan, $document] = array_map($this->identified(...), ['report 1', 'plan 1', 'doc 1']);

        $this->bus()->run(new LinkRecordsCommand($report, $plan));
        $this->bus()->run(new LinkRecordsCommand($report, $document));
        $this->bus()->run(new LinkRecordsCommand($plan, $report));
        $this->assertSame(2, Link::query()->count());

        $this->bus()->run(new UnlinkRecordsCommand($document, $report));

        $this->assertSame(
            ['plan 1'],
            array_map(fn ($card) => $card->label, $this->records()->linkedCards(Report::query()->sole())),
        );
        $this->assertSame(1, Document::query()->count());
    }

    public function test_doc_make_about_a_task_links_it_and_a_private_or_extra_target_creates_nothing(): void
    {
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

    public function test_an_agent_sees_no_trace_of_a_link_to_another_agents_message(): void
    {
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "Text\n"));
        $message = $this->messageFor(8);
        $stored = Message::query()->withoutGlobalScopes()->whereKey($message->id)->sole();
        Link::createForModels(Document::query()->sole(), $stored);

        $this->actAsAgent(9);

        $this->assertSame([], $this->records()->linkedCards(Document::query()->sole()));
    }

    private function messageFor(int $agent): Message
    {
        $recipient = TestActors::stack($agent, $agent * 10)->actorIdentity();

        return $this->askInboxOf($recipient, "Private plan\nDetails.");
    }

    /**
     * @param  callable(): mixed  $read
     */
    private function refusalOf(callable $read): string
    {
        try {
            $read();
        } catch (RecordUnavailable $refused) {
            return $refused->getMessage();
        }

        $this->fail('The read was not refused.');
    }

    public function test_the_page_adds_and_removes_a_link_and_goes_back_to_the_record(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        Plan::factory()->create(['title' => 'Version 6', 'type' => PlanType::Build]);
        $this->bus()->run(new CreateReportCommand('Check', 'What we found', "All good\n"));
        $link = ['source' => 'report 1', 'target' => 'plan 1'];

        $this->actingAs($owner)->from('/reports/1')->post('/links/add', $link)->assertRedirect('/reports/1');
        $this->assertSame(1, Link::query()->count());

        $this->actingAs($owner)->from('/reports/1')->post('/links/remove', $link)->assertRedirect('/reports/1');
        $this->assertSame(0, Link::query()->count());
    }

    private function actAsUser(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            TestActors::user(1),
            new OwnerAuthority('test'),
        );
    }

    private function identified(string $reference): RecordIdentity
    {
        return $this->records()->identify(RecordReference::parse($reference));
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

    private function records(): RecordResolver
    {
        return $this->app->make(RecordResolver::class);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
