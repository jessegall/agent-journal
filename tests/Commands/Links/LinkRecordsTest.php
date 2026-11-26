<?php

declare(strict_types=1);

namespace Tests\Commands\Links;

use App\Commands\Links\LinkRecords\LinkRecordsCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Exceptions\CrossProjectEdge;
use App\Exceptions\RecordUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Messages\Message;
use App\Models\Projects\Environment;
use App\Models\Records\Link;
use App\Support\Access\AccessSettings;
use App\Support\ActorReference;
use App\Support\AgentContext;
use App\Support\RecordIdentity;
use App\Support\SignedCall;
use App\Values\OwnerAuthority;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Models\Document;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestProjects;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * A reader links one record to another once, whichever way round it is named again; a record that is not there is
 * refused and links nothing, two records of different projects are never linked, and a link takes its project from
 * the end that has one.
 */
#[TestsCommand(LinkRecordsCommand::class)]
final class LinkRecordsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'links',
        'project_environments',
        'projects',
        'tasks',
        'messages',
        'phases',
        'plans',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
        'users',
    ];

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class, DocumentsDomain::class, PlansDomain::class);
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->placeBareAgentsInLocalProject();
    }

    public function test_two_records_are_linked_once_whichever_way_round(): void
    {
        $this->journal->owner();
        $first = Task::create(
            'First',
            'One.',
            $this->journal->ownerUser(),
            TestProjects::ownerOf($this->journal->ownerUser()),
        )->assignmentIdentity();
        $second = Task::create(
            'Second',
            'Two.',
            $this->journal->ownerUser(),
            TestProjects::ownerOf($this->journal->ownerUser()),
        )->assignmentIdentity();

        $this->journal->run(new LinkRecordsCommand($first, $second));
        $this->journal->run(new LinkRecordsCommand($second, $first));

        $this->assertSame(1, Link::query()->count());
    }

    public function test_a_record_that_is_not_there_is_refused_and_links_nothing(): void
    {
        $this->journal->owner();
        $first = Task::create(
            'First',
            'One.',
            $this->journal->ownerUser(),
            TestProjects::ownerOf($this->journal->ownerUser()),
        )->assignmentIdentity();

        $this->assertThrows(
            fn () => $this->journal->run(
                new LinkRecordsCommand($first, new RecordIdentity($first->type, '01jd8x0g9m3qz6v4k2t7r00000')),
            ),
            RecordUnavailable::class,
        );
        $this->assertSame(0, Link::query()->count());
    }

    public function test_another_agents_message_answers_exactly_like_a_missing_one(): void
    {
        $this->actAsUser();

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

    public function test_an_agent_sees_no_trace_of_a_link_to_another_agents_message(): void
    {
        $this->actAsUser();

        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "Text\n", TestProjects::local()->id));
        $message = $this->messageFor(8);
        $stored = Message::query()->withoutGlobalScopes()->whereKey($message->id)->sole();
        Link::createForModels(Document::query()->sole(), $stored);

        $this->actAsAgent(9);

        $this->assertSame([], $this->records()->linkedCards(Document::query()->sole()));
    }

    public function test_the_page_adds_and_removes_a_link_and_goes_back_to_the_record(): void
    {
        $this->actAsUser();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        Plan::factory()->create(['title' => 'Version 6', 'type' => PlanType::Build]);
        $this->bus()->run(new CreateReportCommand('Check', 'What we found', "All good\n", TestProjects::local()->id));
        $link = ['source' => 'report 1', 'target' => 'plan 1'];

        $this->actingAs($owner)->from('/reports/1')->post('/links/add', $link)->assertRedirect('/reports/1');
        $this->assertSame(1, Link::query()->count());

        $this->actingAs($owner)->from('/reports/1')->post('/links/remove', $link)->assertRedirect('/reports/1');
        $this->assertSame(0, Link::query()->count());
    }

    public function test_records_of_two_projects_are_refused_and_both_stay_unlinked(): void
    {
        $this->journal->owner()->project('Shop');
        $local = Task::create('Here', 'Local work.', $this->journal->ownerUser(), $this->localOwner());
        $shop = Environment::create($this->journal->projectCalled('Shop'), 'Shop work');

        $this->assertThrows(fn () => Link::createForModels($local, $shop), CrossProjectEdge::class);
        $this->assertSame(0, Link::query()->count());
    }

    public function test_a_link_to_a_global_record_stands_and_carries_the_project_of_its_other_end(): void
    {
        $this->journal->owner()->project('Shop');
        $shop = Environment::create($this->journal->projectCalled('Shop'), 'Shop work');

        $link = Link::createForModels($this->journal->ownerUser(), $shop);

        $this->assertSame($this->journal->projectCalled('Shop')->id, $link->project_id);
    }

    private function localOwner(): ProjectOwner
    {
        return TestProjects::ownerOf($this->journal->ownerUser());
    }

    private function records(): RecordResolver
    {
        return $this->app->make(RecordResolver::class);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }

    private function actAsAgent(int $agent): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent(TestIds::of($agent)),
            TestStartAuthority::forAgent(TestIds::of($agent)),
        );
        $call = new SignedCall(TestIds::of(500 + $agent), CarbonImmutable::now(), str_repeat('0', 64));
        $context = new AgentContext(TestIds::of($agent), TestIds::of($agent * 10), $call, null);
        $this->app->instance(AgentContext::class, $context);
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
        $this->app->make(CurrentActorSetter::class)->set(
            TestActors::user(1),
            new OwnerAuthority('test'),
        );
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
