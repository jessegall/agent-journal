<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Domain\Agents\AgentsDomain;
use App\Domain\Chat\ChatDomain;
use App\Domain\Domain;
use App\Domain\Hooks\HooksDomain;
use App\Domain\Links\LinksDomain;
use App\Domain\Memory\MemoryDomain;
use App\Domain\Plans\PlansDomain;
use App\Domain\Processes\ProcessesDomain;
use App\Domain\Profiles\ProfilesDomain;
use App\Domain\Reminders\RemindersDomain;
use App\Domain\Rules\RulesDomain;
use App\Domain\Sequences\SequencesDomain;
use App\Domain\Tasks\TasksDomain;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class DomainClassesTest extends TestCase
{
    /**
     * The edges to Hooks, from Hooks to Agents and Links, and from Agents to Links are declared under rule 11 while question 10 waits; see docs/hooks/dependencies.md.
     *
     * @return iterable<string, array{class-string<Domain>, list<class-string<Domain>>}>
     */
    public static function domains(): iterable
    {
        yield 'Tasks' => [TasksDomain::class, [HooksDomain::class, LinksDomain::class]];
        yield 'Plans' => [PlansDomain::class, [TasksDomain::class]];
        yield 'Links' => [LinksDomain::class, []];
        yield 'Profiles' => [ProfilesDomain::class, []];
        yield 'Agents' => [AgentsDomain::class, [LinksDomain::class]];
        yield 'Hooks' => [HooksDomain::class, [AgentsDomain::class, LinksDomain::class]];
        yield 'Chat' => [ChatDomain::class, [HooksDomain::class]];
        yield 'Memory' => [MemoryDomain::class, []];
        yield 'Rules' => [RulesDomain::class, []];
        yield 'Sequences' => [SequencesDomain::class, [HooksDomain::class]];
        yield 'Reminders' => [RemindersDomain::class, []];
        yield 'Processes' => [ProcessesDomain::class, []];
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
