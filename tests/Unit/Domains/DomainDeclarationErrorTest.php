<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Domains\Exceptions\DomainCycle;
use App\Domains\Exceptions\DomainListedTwice;
use App\Domains\Exceptions\DomainNotFound;
use App\Domains\Exceptions\DomainRequiresItself;
use App\Domains\Exceptions\NotADomain;
use App\Domains\Exceptions\RequiredDomainMissing;
use App\Domains\Exceptions\RequiredDomainTwice;
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
