<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Domain\Access\AccessDomain;
use App\Domain\Chat\ChatDomain;
use App\Domain\Domain;
use App\Domain\Memory\MemoryDomain;
use App\Domain\Plans\PlansDomain;
use App\Domain\Processes\ProcessesDomain;
use App\Domain\Profiles\ProfilesDomain;
use App\Domain\Reminders\RemindersDomain;
use App\Domain\Rules\RulesDomain;
use App\Domain\Sequences\SequencesDomain;
use App\Domain\Tasks\TasksDomain;
use App\Domain\Web\WebDomain;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class DomainClassesTest extends TestCase
{
    /**
     * Hooks, Agents and Links are the core in app/Core, which every domain uses without declaring it.
     *
     * @return iterable<string, array{class-string<Domain>, list<class-string<Domain>>}>
     */
    public static function domains(): iterable
    {
        yield 'Tasks' => [TasksDomain::class, []];
        yield 'Plans' => [PlansDomain::class, [TasksDomain::class]];
        yield 'Profiles' => [ProfilesDomain::class, []];
        yield 'Chat' => [ChatDomain::class, []];
        yield 'Memory' => [MemoryDomain::class, []];
        yield 'Rules' => [RulesDomain::class, []];
        yield 'Sequences' => [SequencesDomain::class, []];
        yield 'Reminders' => [RemindersDomain::class, []];
        yield 'Processes' => [ProcessesDomain::class, []];
        yield 'Access' => [AccessDomain::class, []];
        yield 'Web' => [WebDomain::class, [AccessDomain::class]];
    }

    /**
     * @param  class-string<Domain>  $class
     * @param  list<class-string<Domain>>  $requires
     */
    #[DataProvider('domains')]
    public function test_each_domain_describes_itself_and_requires_only_what_was_approved(string $class, array $requires): void
    {
        $domain = new $class;

        $this->assertNotSame('', $domain->description());
        $this->assertSame($requires, $domain->requires());
    }
}
