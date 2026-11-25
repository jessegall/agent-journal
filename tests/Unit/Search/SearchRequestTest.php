<?php

declare(strict_types=1);

namespace Tests\Unit\Search;

use App\Enums\Search\ScopeAnswer;
use App\Enums\Search\SearchSurface;
use App\Exceptions\SearchRequestInvalid;
use App\Exceptions\SearchWordsInvalid;
use App\Support\ActorContext;
use App\Support\DomainRegistry;
use App\Support\Searchable;
use App\Support\SearchablesRegistry;
use App\Support\SearchEligibility;
use App\Values\ScopeResolution;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchReader;
use App\Values\SearchRequest;
use App\Values\SearchWords;
use Closure;
use Illuminate\Container\Container;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Domains\Searching\Logs\LogsDomain;
use Tests\Fixtures\Domains\Searching\Tasks\TasksDomain;
use Tests\Fixtures\Search\NamedReadGrant;
use Tests\Fixtures\Search\OpenSearchAccess;
use Tests\Fixtures\Search\SwitchedOffDomains;

/**
 * Stories 9 to 15, 33, 34 and 38: the request and its scope are settled from declarations alone, and every
 * refused request is refused before a provider runs.
 */
final class SearchRequestTest extends TestCase
{
    private const string AGENT_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAA';

    private int $providerCalls = 0;

    public function test_story_9_an_exact_key_runs_only_that_source(): void
    {
        $scope = $this->scopeOf(SearchRequest::parse(query: 'driver', within: 'tasks.task'));

        $this->assertSame(ScopeAnswer::Resolved, $scope->answer);
        $this->assertSame('tasks.task', $scope->searchScope()->within);
        $this->assertSame(0, $this->providerCalls);
    }

    public function test_story_10_a_trimmed_label_in_any_case_resolves_like_the_key(): void
    {
        $byLabel = $this->scopeOf(SearchRequest::parse(query: 'driver', within: '  pLaNs '));

        $this->assertSame('plans.plan', $byLabel->searchScope()->within);
    }

    public function test_story_11_an_ambiguous_label_lists_eligible_keys_and_offers_discovery(): void
    {
        $scope = $this->scopeOf(SearchRequest::parse(query: 'driver', within: 'Tasks'));

        $this->assertSame(ScopeAnswer::Ambiguous, $scope->answer);
        $this->assertSame(['logs.line', 'tasks.task'], $scope->keys());
        $this->assertTrue($scope->offersDiscovery());
        $this->assertSame(0, $this->providerCalls);
    }

    public function test_story_12_a_partial_key_is_an_unknown_scope_with_choices_and_no_reads(): void
    {
        $scope = $this->scopeOf(SearchRequest::parse(query: 'driver', within: 'tasks.ta'));

        $this->assertSame(ScopeAnswer::Unknown, $scope->answer);
        $this->assertSame(['logs.line', 'plans.plan', 'tasks.task'], $scope->keys());
        $this->assertTrue($scope->offersDiscovery());
        $this->assertSame(0, $this->providerCalls);
    }

    public function test_story_13_one_character_explains_the_minimum_and_two_are_accepted(): void
    {
        try {
            SearchRequest::parse(query: ' d ');
            $this->fail('One character was accepted.');
        } catch (SearchWordsInvalid $refusal) {
            $this->assertSame(SearchWordsInvalid::tooShort(SearchWords::CHARACTER_MINIMUM)->getMessage(), $refusal->getMessage());
        }

        $this->assertSame('dr', SearchRequest::parse(query: 'dr')->words?->text);
    }

    public function test_story_14_201_characters_are_refused_and_200_accepted(): void
    {
        $this->assertSame(200, mb_strlen((string) SearchRequest::parse(query: str_repeat('ä', 200))->words?->text));

        try {
            SearchRequest::parse(query: str_repeat('secret', 34));
            $this->fail('201 characters were accepted.');
        } catch (SearchWordsInvalid $refusal) {
            $this->assertSame(SearchWordsInvalid::tooLong(SearchWords::CHARACTER_LIMIT)->getMessage(), $refusal->getMessage());
            $this->assertStringNotContainsString('secret', $refusal->getMessage());
        }
    }

    public function test_story_15_punctuation_and_underscore_stay_literal(): void
    {
        $words = SearchRequest::parse(query: '50%_done')->words;

        $this->assertNotNull($words);
        $this->assertSame('50%_done', $words->folded);
        $this->assertTrue($words->isFoundIn('Reached 50%_done today'));
        $this->assertFalse($words->isFoundIn('Reached 50 done today'));
    }

    public function test_story_33_a_limit_of_one_is_accepted(): void
    {
        $this->assertSame(1, SearchRequest::parse(query: 'driver', limit: 1)->limit);
        $this->assertSame(SearchRequest::DEFAULT_LIMIT, SearchRequest::parse(query: 'driver')->limit);
    }

    public function test_story_34_fifty_is_accepted_and_51_refused_before_reads(): void
    {
        $this->assertSame(50, SearchRequest::parse(query: 'driver', limit: 50)->limit);

        $this->expectException(SearchRequestInvalid::class);

        SearchRequest::parse(query: 'driver', limit: 51);
    }

    public function test_story_38_a_cursor_with_new_words_conflicts_and_the_cursor_stays_usable(): void
    {
        $words = 'other words';

        try {
            SearchRequest::parse(query: $words, continuation: 'handle');
            $this->fail('A continuation with new words was accepted.');
        } catch (SearchRequestInvalid $refusal) {
            $this->assertSame(SearchRequestInvalid::conflicting('continuation', 'query')->getMessage(), $refusal->getMessage());
            $this->assertStringNotContainsString($words, $refusal->getMessage());
        }

        $this->assertTrue(SearchRequest::parse(continuation: 'handle')->continues());
        $this->assertTrue(SearchRequest::parse(query: 'other words')->isFresh());
    }

    public function test_discovery_takes_a_prefix_and_no_words(): void
    {
        $request = SearchRequest::parse(shouldDiscover: true, prefix: ' ta ');

        $this->assertTrue($request->isDiscovery());
        $this->assertSame('ta', $request->prefix);

        $this->expectException(SearchRequestInvalid::class);
        SearchRequest::parse(query: 'driver', shouldDiscover: true);
    }

    private function scopeOf(SearchRequest $request): ScopeResolution
    {
        $reader = new SearchReader(ActorContext::forAgent(self::AGENT_ID), SearchSurface::AgentTool);

        return $this->eligibility()->scopeOf($reader, $request);
    }

    private function eligibility(): SearchEligibility
    {
        $declarations = DomainRegistry::from([TasksDomain::class, LogsDomain::class])->searchableDeclarations();
        $plans = Searchable::make('plan', 'Plans', OpenSearchAccess::class, $this->countingProvider());
        $declarations['Plans'] = [$plans];

        return new SearchEligibility(
            SearchablesRegistry::publishing($declarations),
            new SwitchedOffDomains(),
            new NamedReadGrant(['tasks_read', 'logs_read']),
            new Container(),
        );
    }

    private function countingProvider(): Closure
    {
        return function (SearchQuery $query): SearchBatch {
            $this->providerCalls++;

            return SearchBatch::exhausted('1', []);
        };
    }
}
