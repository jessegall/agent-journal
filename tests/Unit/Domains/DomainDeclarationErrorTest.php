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

final class DomainDeclarationErrorTest extends TestCase
{
    public function test_a_domain_that_requires_itself_is_named(): void
    {
        $this->assertSame(
            'Tasks requires itself; a domain always uses its own code.',
            DomainRequiresItself::for('Tasks')->getMessage(),
        );
    }

    public function test_a_domain_required_twice_names_both_domains(): void
    {
        $this->assertSame(
            'Plans requires Tasks twice.',
            RequiredDomainTwice::for('Plans', 'Tasks')->getMessage(),
        );
    }

    public function test_a_missing_required_domain_names_the_list(): void
    {
        $this->assertSame(
            'Plans requires Tasks, which is not in bootstrap/domains.php.',
            RequiredDomainMissing::for('Plans', 'Tasks')->getMessage(),
        );
    }

    public function test_a_cycle_names_the_domains_in_order(): void
    {
        $this->assertSame(
            'Domains require each other: Plans, Tasks, Plans. Let one side listen to the other events instead.',
            DomainCycle::for(['Plans', 'Tasks', 'Plans'])->getMessage(),
        );
    }

    public function test_a_class_that_is_not_a_domain_is_named(): void
    {
        $this->assertSame(
            'App\Domain\Tasks\TaskList does not implement App\Domains\Contracts\Domain.',
            NotADomain::for('App\Domain\Tasks\TaskList')->getMessage(),
        );
    }

    public function test_a_domain_listed_twice_names_the_list(): void
    {
        $this->assertSame(
            'Tasks is listed twice in bootstrap/domains.php.',
            DomainListedTwice::for('Tasks')->getMessage(),
        );
    }

    public function test_an_unknown_domain_is_named(): void
    {
        $this->assertSame(
            'Chat is not a registered domain.',
            DomainNotFound::for('Chat')->getMessage(),
        );
    }
}
