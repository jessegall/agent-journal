<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Agents\AgentsDomain;
use App\Chat\ChatDomain;
use App\Domains\Domain;
use App\Hooks\HooksDomain;
use App\Links\LinksDomain;
use App\Memory\MemoryDomain;
use App\Plans\PlansDomain;
use App\Processes\ProcessesDomain;
use App\Profiles\ProfilesDomain;
use App\Reminders\RemindersDomain;
use App\Rules\RulesDomain;
use App\Sequences\SequencesDomain;
use App\Tasks\TasksDomain;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class DomainClassesTest extends TestCase
{
    /**
     * @return iterable<string, array{class-string<Domain>, list<class-string<Domain>>}>
     */
    public static function domains(): iterable
    {
        yield 'Tasks' => [TasksDomain::class, []];
        yield 'Plans' => [PlansDomain::class, [TasksDomain::class]];
        yield 'Links' => [LinksDomain::class, []];
        yield 'Profiles' => [ProfilesDomain::class, []];
        yield 'Agents' => [AgentsDomain::class, []];
        yield 'Hooks' => [HooksDomain::class, []];
        yield 'Chat' => [ChatDomain::class, []];
        yield 'Memory' => [MemoryDomain::class, []];
        yield 'Rules' => [RulesDomain::class, []];
        yield 'Sequences' => [SequencesDomain::class, []];
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
