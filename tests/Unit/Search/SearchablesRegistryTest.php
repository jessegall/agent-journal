<?php

declare(strict_types=1);

namespace Tests\Unit\Search;

use App\Search\Exceptions\SearchableInvalid;
use App\Search\SearchablesRegistry;
use App\Search\Values\RefreshCandidates;
use App\Search\Values\SearchBatch;
use App\Search\Values\SearchQuery;
use App\Support\DomainRegistry;
use App\Support\SearchSource;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Domains\Searching\Tasks\TasksDomain;
use Tests\Fixtures\Domains\Tasks\TasksDomain as PlainTasksDomain;
use Tests\Fixtures\Search\OpenSearchAccess;

/**
 * The registry qualifies each local key with its lower-case owner and refuses a publication it cannot serve whole,
 * keeping the catalogue it had.
 */
final class SearchablesRegistryTest extends TestCase
{
    public function test_a_domain_declaring_task_publishes_tasks_task(): void
    {
        $domains = DomainRegistry::from([TasksDomain::class]);

        $registry = SearchablesRegistry::publishing($domains->searchableDeclarations());

        $this->assertTrue($registry->has('tasks.task'));
        $this->assertSame('Tasks', $registry->get('tasks.task')->owner);
        $this->assertStringStartsWith($registry->get('tasks.task')->label(), $registry->get('tasks.task')->display());
        $this->assertStringContainsString('tasks.task', $registry->get('tasks.task')->display());
    }

    public function test_a_domain_without_searchables_contributes_nothing(): void
    {
        $domains = DomainRegistry::from([PlainTasksDomain::class]);

        $registry = SearchablesRegistry::publishing($domains->searchableDeclarations());

        $this->assertSame([], $registry->all());
    }

    public function test_a_dotted_local_key_is_refused(): void
    {
        $this->expectException(SearchableInvalid::class);

        self::searchable('tasks.task', 'Tasks');
    }

    public function test_a_local_key_over_48_bytes_is_refused(): void
    {
        $this->expectException(SearchableInvalid::class);

        self::searchable('t'.str_repeat('a', 48), 'Tasks');
    }

    public function test_a_label_blank_after_trimming_is_refused(): void
    {
        $this->expectException(SearchableInvalid::class);

        self::searchable('task', "  \t ");
    }

    public function test_a_label_that_folds_to_a_qualified_key_is_refused(): void
    {
        $this->expectException(SearchableInvalid::class);
        $this->expectExceptionMessage(SearchableInvalid::forQualifiedLabel('tasks.task', 'Plans.Plan')->getMessage());

        SearchablesRegistry::publishing(['Tasks' => [self::searchable('task', 'Plans.Plan')]]);
    }

    public function test_a_qualified_key_over_64_bytes_is_refused(): void
    {
        $this->expectException(SearchableInvalid::class);

        SearchablesRegistry::publishing([str_repeat('o', 20) => [self::searchable(str_repeat('k', 44), 'Long')]]);
    }

    public function test_a_duplicate_qualified_key_names_both_owners_and_keeps_the_old_catalogue(): void
    {
        $registry = SearchablesRegistry::publishing(['Tasks' => [self::searchable('task', 'Tasks')]]);

        try {
            $registry->publish([
                'Tasks' => [self::searchable('task', 'Tasks')],
                'TASKS' => [self::searchable('task', 'Other tasks')],
            ]);
            $this->fail('A duplicate qualified key was published.');
        } catch (SearchableInvalid $refusal) {
            $this->assertSame(SearchableInvalid::forDuplicate('tasks.task', 'Tasks', 'TASKS')->getMessage(), $refusal->getMessage());
        }

        $this->assertSame(['tasks.task'], array_map(fn ($source) => $source->qualifiedKey, $registry->all()));
        $this->assertSame('Tasks', $registry->get('tasks.task')->label());
    }

    public function test_all_lists_sources_in_binary_key_order(): void
    {
        $registry = SearchablesRegistry::publishing([
            'Tasks' => [self::searchable('task', 'Tasks'), self::searchable('task_log', 'Task log lines')],
            'Plans' => [self::searchable('plan', 'Plans')],
        ]);

        $this->assertSame(
            ['plans.plan', 'tasks.task', 'tasks.task_log'],
            array_map(fn ($source) => $source->qualifiedKey, $registry->all()),
        );
    }

    private static function searchable(string $key, string $label): SearchSource
    {
        return SearchSource::make(
            $key,
            $label,
            OpenSearchAccess::class,
            fn (SearchQuery|RefreshCandidates $query): SearchBatch => SearchBatch::exhausted('1', []),
        );
    }
}
