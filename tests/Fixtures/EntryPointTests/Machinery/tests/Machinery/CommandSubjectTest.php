<?php

declare(strict_types=1);

namespace Tests\Fixtures\EntryPointTests\Machinery\tests\Machinery;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use PHPUnit\Framework\TestCase;
use Tests\Support\Entries\Attributes\TestsMachinery;

/**
 * A machinery test naming a command: the machinery check sends it to the command's test.
 */
#[TestsMachinery(StartAgentCommand::class)]
final class CommandSubjectTest extends TestCase
{
    public function test_it_is_judged_by_what_it_names(): void
    {
        $this->assertTrue(true);
    }
}
