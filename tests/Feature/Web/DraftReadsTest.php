<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Enums\Accounts\SignInMethod;
use App\Http\Responses\PageReadProps;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use App\Support\AccountDraftProducer;
use App\Support\DraftProducers;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Support\DocumentDraftProducer;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanDraftProducer;
use Domain\Sequences\SequencesDomain;
use Domain\Sequences\Support\SequenceDraftProducer;
use Domain\Tasks\Support\TaskDraftProducer;
use Domain\Tasks\TasksDomain;
use Illuminate\Testing\TestResponse;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\UiDeclarations\StubDraftProducer;
use Tests\Support\DomainBoot;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Guided creation reads a noun's questions and its drafted record by partial reloads of Home's draft reads, the noun
 * taken as the read's route parameter; a read that names no noun is refused as missing.
 */
final class DraftReadsTest extends TestCase
{
    use RefreshHookDatabase;

    private const string TITLE = 'Ship-it';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class, PlansDomain::class, SequencesDomain::class, TasksDomain::class);
    }

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->app->make(DraftProducers::class)->register('note', StubDraftProducer::class);
    }

    public function test_the_questions_and_the_drafted_record_are_read_by_partial_reload(): void
    {
        $questions = $this->pageRead('web.draft-questions', ['noun' => 'note'])->assertOk();
        $record = $this->pageRead('web.draft-record', ['noun' => 'note', 'answers' => [self::TITLE, 'Yes', 'No']])
            ->assertOk();

        $this->assertCount(3, $questions->json('props.read_web_draft_questions.questions'));
        $this->assertSame(self::TITLE, $record->json('props.read_web_draft_record.fields.title'));
        $this->assertSame(StubDraftProducer::AGENT, $record->json('props.read_web_draft_record.agent'));
    }

    /**
     * @return array<string, array{string, list<string>, string}>
     */
    public static function installedNouns(): array
    {
        return [
            'task' => ['task', ['title', 'brief'], TaskDraftProducer::AGENT],
            'plan' => ['plan', ['title', 'brief', 'type'], PlanDraftProducer::AGENT],
            'document' => ['document', ['title', 'abstract', 'body'], DocumentDraftProducer::AGENT],
            'sequence' => ['sequence', ['name', 'steps', 'doneWhen', 'draftedBy'], SequenceDraftProducer::AGENT],
        ];
    }

    /**
     * @param  list<string>  $fields
     */
    #[DataProvider('installedNouns')]
    public function test_each_domain_drafts_its_noun_from_three_answers(string $noun, array $fields, string $agent): void
    {
        $questions = $this->pageRead('web.draft-questions', ['noun' => $noun])->assertOk();
        $record = $this->pageRead('web.draft-record', ['noun' => $noun, 'answers' => ['Plan, build', 'Tested', 'Nothing']])
            ->assertOk();

        $this->assertCount(3, $questions->json('props.read_web_draft_questions.questions'));
        $this->assertSame($fields, array_keys($record->json('props.read_web_draft_record.fields')));
        $this->assertSame($agent, $record->json('props.read_web_draft_record.agent'));
    }

    public function test_an_account_is_drafted_with_its_program_its_way_to_sign_in_and_its_name(): void
    {
        $record = $this->pageRead('web.draft-record', ['noun' => 'account', 'answers' => ['Codex', 'An API key', 'Team']])
            ->assertOk();

        $this->assertSame(
            ['driver' => 'codex', 'method' => SignInMethod::ApiKey->value, 'name' => 'Team'],
            $record->json('props.read_web_draft_record.fields'),
        );
        $this->assertSame(AccountDraftProducer::AGENT, $record->json('props.read_web_draft_record.agent'));
    }

    public function test_a_read_that_names_no_noun_is_refused_as_missing(): void
    {
        $this->pageRead('web.draft-questions', [])->assertNotFound();
    }

    /**
     * @param  array<string, mixed>  $query
     */
    private function pageRead(string $routeName, array $query): TestResponse
    {
        $prop = PageReadProps::propName($routeName);
        $page = $this->actingAs($this->owner)->get('/')->viewData('page');

        return $this->actingAs($this->owner)->get('/?'.http_build_query([PageReadProps::QUERY => [$prop => $query]]), [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $page['version'],
            'X-Inertia-Partial-Component' => $page['component'],
            'X-Inertia-Partial-Data' => $prop,
        ]);
    }
}
