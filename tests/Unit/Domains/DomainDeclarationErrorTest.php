<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Exceptions\DomainCycle;
use App\Exceptions\DomainListedTwice;
use App\Exceptions\DomainNotFound;
use App\Exceptions\DomainRequiresItself;
use App\Exceptions\NotADomain;
use App\Exceptions\RequiredDomainMissing;
use App\Exceptions\RequiredDomainTwice;
use PHPUnit\Framework\TestCase;
use Throwable;

final class DomainDeclarationErrorTest extends TestCase
{
    public function test_a_domain_that_requires_itself_is_named(): void
    {
        $this->assertNames(DomainRequiresItself::for('Tasks'), 'Tasks');
    }

    public function test_a_domain_required_twice_names_both_domains(): void
    {
        $this->assertNames(RequiredDomainTwice::for('Plans', 'Tasks'), 'Plans', 'Tasks');
    }

    public function test_a_missing_required_domain_names_the_list(): void
    {
        $this->assertNames(RequiredDomainMissing::for('Plans', 'Tasks'), 'Plans', 'Tasks', 'bootstrap/domains.php');
    }

    public function test_a_cycle_names_the_domains_in_order(): void
    {
        $this->assertNames(DomainCycle::for(['Plans', 'Tasks', 'Plans']), implode(', ', ['Plans', 'Tasks', 'Plans']));
    }

    public function test_a_class_that_is_not_a_domain_is_named(): void
    {
        $this->assertNames(NotADomain::for('App\\Domain\\Tasks\\TaskList'), 'App\\Domain\\Tasks\\TaskList');
    }

    public function test_a_domain_listed_twice_names_the_list(): void
    {
        $this->assertNames(DomainListedTwice::for('Tasks'), 'Tasks', 'bootstrap/domains.php');
    }

    public function test_an_unknown_domain_is_named(): void
    {
        $this->assertNames(DomainNotFound::for('Chat'), 'Chat');
    }

    private function assertNames(Throwable $error, string ...$names): void
    {
        foreach ($names as $name) {
            $this->assertStringContainsString($name, $error->getMessage());
        }
    }
}
