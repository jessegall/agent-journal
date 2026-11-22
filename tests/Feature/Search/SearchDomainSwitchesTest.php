<?php

declare(strict_types=1);

namespace Tests\Feature\Search;

use App\Commands\DisableSettingGroup\DisableSettingGroupCommand;
use App\Commands\EnableSettingGroup\EnableSettingGroupCommand;
use App\Contracts\CommandBus;
use App\Enums\SearchStatus;
use App\Enums\SearchSurface;
use App\Support\SearchCoordinator;
use App\Support\SearchEligibility;
use App\Values\DeclaredSearchable;
use App\Values\EmittedHit;
use App\Values\GroupReference;
use App\Values\SearchAnswer;
use App\Values\SearchOwner;
use App\Values\SearchReader;
use App\Values\SearchRequest;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Tasks\Models\Task;
use Tests\Support\ActsAsActors;
use Tests\Support\ActsAsTestOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Stories 4, 6 and 7 with Documents: switching it off removes documents.document and documents.report from discovery
 * and new searches and an open search drops their work; switching it on shows them on the next request and in a
 * fresh search; a domain whose requirement is off loses its sources too; an empty declared domain is complete with
 * zero hits.
 */
final class SearchDomainSwitchesTest extends TestCase
{
    use ActsAsActors;
    use ActsAsTestOwner;
    use CommitsHookRows;

    private const array TABLES = [
        'settings_records', 'number_groups', 'links', 'tasks', 'rules', 'documents', 'document_revisions',
        'document_drafts', 'document_closes',
    ];

    private int $revision = 0;

    public function test_switching_documents_off_and_on_removes_and_restores_its_sources(): void
    {
        $this->actAs(TestActors::user(7));
        $this->app->make(CommandBus::class)->run(
            new CreateDocumentCommand('Harbor guide', 'About the harbor.', "# Harbor\nThe harbor plan.\n"),
        );

        $this->switchOff('domain_documents');
        $this->assertNotContains('documents.document', $this->discovered('do'));
        $this->assertNotContains('documents.report', $this->discovered('re'));
        $this->assertSame(SearchStatus::UnknownScope, $this->search('harbor', 'documents.document')->status);
        $this->assertSame([], self::sourcesOf($this->search('harbor', null)));

        $this->switchOn('domain_documents');
        $this->assertContains('documents.document', $this->discovered('do'));
        $this->assertSame(['documents.document'], self::sourcesOf($this->search('harbor', null)));
    }

    public function test_an_open_search_drops_the_work_of_a_domain_switched_off_and_continues(): void
    {
        $this->actAs(TestActors::user(7));
        Task::factory()->create(['title' => 'Harbor one']);
        Task::factory()->create(['title' => 'Harbor two']);
        $this->app->make(CommandBus::class)->run(
            new CreateDocumentCommand('Harbor three', 'About the harbor.', "# Harbor\nText.\n"),
        );

        $first = $this->search('harbor', null, 1);
        $this->switchOff('domain_documents');
        $rest = $this->resumeAll($first);

        $this->assertNotContains('documents.document', $rest);
        $this->assertContains('tasks.task', $rest);
    }

    public function test_a_domain_whose_requirement_is_off_loses_its_sources(): void
    {
        $this->switchOff('domain_tasks');

        $this->assertNotContains('tasks.task', $this->discovered('ta'));
        $this->assertNotContains('plans.plan', $this->discovered('pl'));
    }

    public function test_an_empty_declared_domain_is_complete_with_zero_hits(): void
    {
        $answer = $this->search('anything at all', 'rules.rule');

        $this->assertSame(SearchStatus::Complete, $answer->status);
        $this->assertSame([], $answer->hits);
    }

    /**
     * @return list<string>
     */
    private function discovered(string $prefix): array
    {
        $page = $this->eligibility()->discover($this->reader(), $prefix, 50);

        return array_map(fn (DeclaredSearchable $source) => $source->qualifiedKey, $page->sources);
    }

    private function search(string $words, string|null $within, int $limit = 10): SearchAnswer
    {
        return $this->coordinator()->search(
            $this->owner(),
            $this->reader(),
            SearchRequest::parse(query: $words, within: $within, limit: $limit),
        );
    }

    /**
     * The sources of every hit from the first answer's continuation to the end.
     *
     * @return list<string>
     */
    private function resumeAll(SearchAnswer $answer): array
    {
        $sources = [];

        for ($call = 0; $call < 20 && $answer->continuation !== null; $call++) {
            $answer = $this->coordinator()->search(
                $this->owner(),
                $this->reader(),
                SearchRequest::parse(continuation: $answer->continuation),
            );
            array_push($sources, ...self::sourcesOf($answer));
        }

        return array_values(array_unique($sources));
    }

    /**
     * @return list<string>
     */
    private static function sourcesOf(SearchAnswer $answer): array
    {
        return array_values(array_unique(array_map(fn (EmittedHit $hit) => $hit->sourceKey, $answer->hits)));
    }

    /**
     * The search of a new request, reading the switches as they are now.
     */
    private function coordinator(): SearchCoordinator
    {
        $this->freshRequest();

        return $this->app->make(SearchCoordinator::class);
    }

    private function eligibility(): SearchEligibility
    {
        $this->freshRequest();

        return $this->app->make(SearchEligibility::class);
    }

    private function freshRequest(): void
    {
        $this->app->forgetScopedInstances();
        $this->actAs(TestActors::user(7));
    }

    private function reader(): SearchReader
    {
        return new SearchReader(TestActors::user(7), SearchSurface::Palette);
    }

    private function owner(): SearchOwner
    {
        return new SearchOwner('session', TestActors::user(7), '', 'search', SearchSurface::Palette);
    }

    private function switchOff(string $key): void
    {
        $this->app->make(CommandBus::class)->run(
            new DisableSettingGroupCommand(new GroupReference('Core', $key), $this->revision++),
        );
    }

    private function switchOn(string $key): void
    {
        $this->app->make(CommandBus::class)->run(
            new EnableSettingGroupCommand(new GroupReference('Core', $key), $this->revision++),
        );
    }
}
