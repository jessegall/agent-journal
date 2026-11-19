<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ExceptionPlacement;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Rule 14: every exception class of a domain or the core lives in that domain's or core area's Exceptions folder.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class ExceptionPlacementTest extends TestCase
{
    public function test_an_exception_outside_an_exceptions_folder_is_named_and_one_inside_passes(): void
    {
        $this->assertSame(
            ['Tests\Fixtures\Exceptions\Loose\OrderRefused'],
            ExceptionPlacement::misplacedIn([base_path('tests/Fixtures/Exceptions')]),
        );
    }

    public function test_every_exception_of_the_domains_and_the_core_lies_in_an_exceptions_folder(): void
    {
        $this->assertSame([], ExceptionPlacement::misplacedIn([app_path(), ...DomainFiles::domainCode()]));
    }
}
