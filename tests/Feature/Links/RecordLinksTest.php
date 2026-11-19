<?php

declare(strict_types=1);

namespace Tests\Feature\Links;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Bus\Contracts\CommandBus;
use App\Communication\Models\Message;
use App\Links\Exceptions\UnknownLinkType;
use App\Links\Models\Link;
use App\Numbers\Support\RecordReference;
use App\Records\Commands\LinkRecords;
use App\Records\Commands\UnlinkRecords;
use App\Records\Contracts\RecordResolver;
use App\Records\Exceptions\InvalidRecordIdentity;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use App\Text\Exceptions\ContentTooLarge;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestLaunchAuthority;
use Tests\TestCase;

/**
 * Core reads and links records of every domain through the providers their owners register, and never lets a
 * record the actor may not read show itself, not even as a missing link.
 */
final class RecordLinksTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['links', 'messages', 'tasks', 'phases', 'plans', 'reports', 'document_revisions', 'documents', 'number_groups'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsUser();
    }

    public function test_a_task_a_plan_and_a_document_are_read_as_cards_by_their_reference(): void
    {
        Task::factory()->create(['title' => 'Write the client']);
        Plan::factory()->create(['title' => 'Version 6', 'type' => PlanType::Build]);
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n"));

        $cards = array_map(fn (string $reference) => $this->records()->card($this->records()->identify(RecordReference::parse($reference))), ['task 1', 'plan 1', 'doc 1']);

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
        $hidden = $this->refusalOf(fn () => $this->records()->card(new RecordIdentity(Message::LINK_TYPE, $message->id)));
        $missing = $this->refusalOf(fn () => $this->records()->card(new RecordIdentity(Message::LINK_TYPE, $id)));

        $this->assertSame(str_replace($message->id, 'ID', $hidden), str_replace($id, 'ID', $missing));
        $this->assertSame([], $this->records()->visibleCards([new RecordIdentity(Message::LINK_TYPE, $message->id)]));
    }

    public function test_a_report_links_to_a_plan_and_a_document_once_and_unlinking_keeps_both_records(): void
    {
        Plan::factory()->create(['title' => 'Version 6', 'type' => PlanType::Build]);
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n"));
        $this->bus()->run(new CreateReport('Check', 'What we found', "All good\n"));
        [$report, $plan, $document] = array_map(fn (string $reference) => $this->records()->identify(RecordReference::parse($reference)), ['report 1', 'plan 1', 'doc 1']);

        $this->bus()->run(new LinkRecords($report, $plan));
        $this->bus()->run(new LinkRecords($report, $document));
        $this->bus()->run(new LinkRecords($plan, $report));
        $this->assertSame(2, Link::query()->count());

        $this->bus()->run(new UnlinkRecords($document, $report));

        $this->assertSame(['plan 1'], array_map(fn ($card) => $card->label, $this->records()->linkedCards(Report::query()->sole())));
        $this->assertSame(1, Document::query()->count());
    }

    public function test_doc_make_about_a_task_links_it_and_a_private_or_extra_target_creates_nothing(): void
    {
        Task::factory()->create(['title' => 'Write the client']);
        $task = $this->records()->identify(RecordReference::parse('task 1'));

        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n", [$task]));
        $this->assertSame(1, Link::query()->count());

        $message = $this->messageFor(8);
        $this->actAsAgent(9);

        try {
            $this->bus()->run(new CreateDocument('Leak', 'Should not exist', "Text\n", [new RecordIdentity(Message::LINK_TYPE, $message->id)]));
            $this->fail('A document about a private message was created.');
        } catch (RecordUnavailable) {
            $this->assertSame(1, Document::query()->count());
        }

        $this->expectException(ContentTooLarge::class);
        $this->bus()->run(new CreateDocument('Many', 'Too many links', "Text\n", array_fill(0, 51, $task)));
    }

    public function test_an_agent_sees_no_trace_of_a_link_to_another_agents_message(): void
    {
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n"));
        $message = $this->messageFor(8);
        Link::connect(Document::query()->sole(), Message::query()->acrossOwners()->whereKey($message->id)->sole());

        $this->actAsAgent(9);

        $this->assertSame([], $this->records()->linkedCards(Document::query()->sole()));
    }

    private function messageFor(int $agent): Message
    {
        $message = Message::write("Private plan\nDetails.");
        $message->requireAnswerFrom(new StackTarget(TestIds::of($agent), TestIds::of($agent * 10))->actorIdentity());

        return $message;
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

    private function actAsUser(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(1)), new OwnerAuthority('test'));
    }

    private function actAsAgent(int $agent): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent(TestIds::of($agent)), TestLaunchAuthority::forAgent(TestIds::of($agent)));
        $this->app->instance(AgentContext::class, new AgentContext(TestIds::of($agent), TestIds::of($agent * 10), 'hooks.main_ready', new SignedCall(TestIds::of(500 + $agent), CarbonImmutable::now(), str_repeat('0', 64)), null));
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
