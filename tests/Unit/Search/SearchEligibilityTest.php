<?php

declare(strict_types=1);

namespace Tests\Unit\Search;

use App\Enums\Search\ScopeAnswer;
use App\Enums\Search\SearchSurface;
use App\Exceptions\SearchableMissing;
use App\Support\ActorIdentity;
use App\Support\DomainRegistry;
use App\Support\SearchablesRegistry;
use App\Support\SearchSources;
use App\Values\DiscoveryPage;
use App\Values\ScopeResolution;
use App\Values\SearchReader;
use Illuminate\Container\Container;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Domains\Searching\Logs\LogsDomain;
use Tests\Fixtures\Domains\Searching\Tasks\TasksDomain;
use Tests\Fixtures\Search\NamedReadGrant;
use Tests\Fixtures\Search\SwitchedOffDomains;

/**
 * A source the reader may not search, because its domain is off or its policy refuses the reader, reads exactly as
 * one that does not exist: in discovery, in key and label resolution and in the source lookup.
 */
final class SearchEligibilityTest extends TestCase
{
    private const string AGENT_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAA';

    private const string USER_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAB';

    public function test_tasks_task_is_found_by_key_and_by_label(): void
    {
        $eligibility = self::eligibility([], ['tasks_read']);
        $user = self::user();

        $byKey = $eligibility->resolve($user, 'tasks.task');
        $byLabel = $eligibility->resolve($user, '  TASKS ');

        $this->assertTrue($byKey->isResolved());
        $this->assertSame('tasks.task', $byKey->source()->qualifiedKey);
        $this->assertTrue($byLabel->isResolved());
        $this->assertSame('tasks.task', $byLabel->source()->qualifiedKey);
    }

    public function test_the_exact_key_wins_and_is_case_sensitive(): void
    {
        $resolution = self::eligibility([], ['tasks_read'])->resolve(self::user(), 'Tasks.Task');

        $this->assertSame(ScopeAnswer::Unknown, $resolution->answer);
        $this->assertTrue($resolution->offersDiscovery());
        $this->assertSame(['discover' => true, 'prefix' => ''], ScopeResolution::DISCOVERY_ACTION);
    }

    public function test_a_shared_label_gives_a_choice_of_eligible_keys(): void
    {
        $resolution = self::eligibility([], ['tasks_read', 'logs_read'])->resolve(self::agent(), 'Tasks');

        $this->assertSame(ScopeAnswer::Ambiguous, $resolution->answer);
        $this->assertSame(['logs.line', 'tasks.task'], $resolution->keys());
        $this->assertSame(['Tasks (logs.line)', 'Tasks (tasks.task)'], $resolution->displays());
    }

    public function test_a_source_the_user_may_not_search_is_left_out_of_the_choice(): void
    {
        $resolution = self::eligibility([], ['tasks_read', 'logs_read'])->resolve(self::user(), 'Tasks');

        $this->assertTrue($resolution->isResolved());
        $this->assertSame('tasks.task', $resolution->source()->qualifiedKey);
    }

    public function test_a_switched_off_domain_loses_its_key(): void
    {
        $eligibility = self::eligibility(['Tasks'], ['tasks_read']);

        $this->assertSame(ScopeAnswer::Unknown, $eligibility->resolve(self::agent(), 'tasks.task')->answer);
        $this->assertSame([], $eligibility->discover(self::agent(), 'ta')->sources);

        $this->expectException(SearchableMissing::class);
        $eligibility->source(self::agent(), 'tasks.task');
    }

    public function test_an_agent_without_the_grant_gets_the_unknown_scope_answer(): void
    {
        $eligibility = self::eligibility([], []);

        $resolution = $eligibility->resolve(self::agent(), 'tasks.task');

        $this->assertSame(ScopeAnswer::Unknown, $resolution->answer);
        $this->assertSame([], $resolution->keys());

        $this->expectExceptionObject(SearchableMissing::forKey('tasks.task'));
        $eligibility->source(self::agent(), 'tasks.task');
    }

    public function test_discovery_pages_key_and_label_prefixes_with_a_continuation(): void
    {
        $eligibility = self::eligibility([], ['tasks_read', 'logs_read']);

        $first = $eligibility->discover(self::agent(), 'ta', 1);
        $second = $eligibility->discover(self::agent(), $first->prefix, 1, $first->nextAfter);

        $this->assertSame(['logs.line'], array_map(fn ($source) => $source->qualifiedKey, $first->sources));
        $this->assertTrue($first->hasMore());
        $this->assertSame('ta', $second->prefix);
        $this->assertSame(['tasks.task'], array_map(fn ($source) => $source->qualifiedKey, $second->sources));
        $this->assertFalse($second->hasMore());
        $this->assertSame(10, DiscoveryPage::DEFAULT_SIZE);
    }

    /**
     * @param  list<string>  $switchedOff
     * @param  list<string>  $agentReads
     */
    private static function eligibility(array $switchedOff, array $agentReads): SearchSources
    {
        $domains = DomainRegistry::from([TasksDomain::class, LogsDomain::class]);

        return new SearchSources(
            SearchablesRegistry::publishing($domains->searchableDeclarations()),
            new SwitchedOffDomains($switchedOff),
            new NamedReadGrant($agentReads),
            new Container(),
        );
    }

    private static function agent(): SearchReader
    {
        return new SearchReader(ActorIdentity::forAgent(self::AGENT_ID), SearchSurface::AgentTool);
    }

    private static function user(): SearchReader
    {
        return new SearchReader(ActorIdentity::forUser(self::USER_ID), SearchSurface::Palette);
    }
}
