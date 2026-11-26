<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Bootstrap\Exceptions\DomainNotFound;
use App\Exceptions\DomainCycle;
use App\Exceptions\DomainListedTwice;
use App\Exceptions\DomainRequiresItself;
use App\Exceptions\NotADomain;
use App\Exceptions\RequiredDomainMissing;
use App\Exceptions\RequiredDomainTwice;
use App\Support\DomainRegistry;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Domains\ClassRequiring\ClassRequiringDomain;
use Tests\Fixtures\Domains\DoubleRequiring\DoubleRequiringDomain;
use Tests\Fixtures\Domains\Plans\PlansDomain;
use Tests\Fixtures\Domains\Reports\ReportsDomain;
use Tests\Fixtures\Domains\SelfRequiring\SelfRequiringDomain;
use Tests\Fixtures\Domains\Tasks\TaskList;
use Tests\Fixtures\Domains\Tasks\TasksDomain;
use Tests\Fixtures\Domains\ThreeCycle\Agents\AgentsDomain;
use Tests\Fixtures\Domains\ThreeCycle\Chat\ChatDomain;
use Tests\Fixtures\Domains\ThreeCycle\Hooks\HooksDomain;
use Tests\Fixtures\Domains\TwoCycle\Orders\OrdersDomain;
use Tests\Fixtures\Domains\TwoCycle\Payments\PaymentsDomain;

final class DomainRegistryTest extends TestCase
{
    public function test_a_valid_list_answers_for_each_domain(): void
    {
        $registry = DomainRegistry::from([TasksDomain::class, PlansDomain::class]);

        $plans = $registry->get('Plans');

        $this->assertSame('Plans', $plans->name);
        $this->assertSame('Tests\Fixtures\Domains\Plans', $plans->namespace);
        $this->assertStringEndsWith('/tests/Fixtures/Domains/Plans', $plans->folder);
        $this->assertSame([TasksDomain::class], $plans->requires);
        $this->assertSame(['Tasks', 'Plans'], array_map(fn ($entry) => $entry->name, $registry->all()));
    }

    public function test_an_empty_list_builds_an_empty_registry(): void
    {
        $registry = DomainRegistry::from([]);

        $this->assertSame([], $registry->all());
        $this->assertFalse($registry->has('Tasks'));
    }

    public function test_it_knows_which_domains_it_has(): void
    {
        $registry = DomainRegistry::from([TasksDomain::class]);

        $this->assertTrue($registry->has('Tasks'));
        $this->assertFalse($registry->has('Plans'));
    }

    public function test_listener_folders_point_inside_each_domain(): void
    {
        $registry = DomainRegistry::from([TasksDomain::class, PlansDomain::class]);

        [$tasksFolder, $plansFolder] = $registry->listenerFolders();

        $this->assertStringEndsWith('/tests/Fixtures/Domains/Tasks/Listeners', $tasksFolder);
        $this->assertStringEndsWith('/tests/Fixtures/Domains/Plans/Listeners', $plansFolder);
    }

    public function test_an_unknown_domain_is_refused(): void
    {
        $this->expectExceptionObject(DomainNotFound::for('Chat'));

        DomainRegistry::from([TasksDomain::class])->get('Chat');
    }

    public function test_a_class_that_does_not_exist_is_not_a_domain(): void
    {
        $this->expectExceptionObject(NotADomain::for('Tests\Fixtures\Domains\Missing\MissingDomain'));

        DomainRegistry::from(['Tests\Fixtures\Domains\Missing\MissingDomain']);
    }

    public function test_a_class_that_is_no_domain_is_refused(): void
    {
        $this->expectExceptionObject(NotADomain::for(TaskList::class));

        DomainRegistry::from([TaskList::class]);
    }

    public function test_a_domain_listed_twice_is_refused(): void
    {
        $this->expectExceptionObject(DomainListedTwice::for('Tasks'));

        DomainRegistry::from([TasksDomain::class, TasksDomain::class]);
    }

    public function test_a_domain_that_requires_itself_is_refused(): void
    {
        $this->expectExceptionObject(DomainRequiresItself::for('SelfRequiring'));

        DomainRegistry::from([SelfRequiringDomain::class]);
    }

    public function test_a_domain_that_requires_a_domain_twice_is_refused(): void
    {
        $this->expectExceptionObject(RequiredDomainTwice::for('DoubleRequiring', 'Tasks'));

        DomainRegistry::from([TasksDomain::class, DoubleRequiringDomain::class]);
    }

    public function test_a_required_class_that_is_no_domain_is_refused(): void
    {
        $this->expectExceptionObject(NotADomain::for(TaskList::class));

        DomainRegistry::from([ClassRequiringDomain::class]);
    }

    public function test_a_required_domain_missing_from_the_list_is_refused(): void
    {
        $this->expectExceptionObject(RequiredDomainMissing::for('Plans', 'Tasks'));

        DomainRegistry::from([PlansDomain::class]);
    }

    public function test_a_cycle_of_two_domains_is_refused_with_its_path(): void
    {
        $this->expectExceptionObject(DomainCycle::for(['Orders', 'Payments', 'Orders']));

        DomainRegistry::from([OrdersDomain::class, PaymentsDomain::class]);
    }

    public function test_a_cycle_of_three_domains_is_refused_with_its_path(): void
    {
        $this->expectExceptionObject(DomainCycle::for(['Chat', 'Hooks', 'Agents', 'Chat']));

        DomainRegistry::from([ChatDomain::class, HooksDomain::class, AgentsDomain::class]);
    }

    public function test_a_list_without_a_cycle_still_builds(): void
    {
        $registry = DomainRegistry::from([TasksDomain::class, PlansDomain::class, ReportsDomain::class]);

        $this->assertCount(3, $registry->all());
    }
}
