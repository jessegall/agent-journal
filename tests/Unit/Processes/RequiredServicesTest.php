<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Contracts\Processes\ShellCommandParser;
use App\Exceptions\ProcessesServiceMissing;
use App\Support\RequiredServices;
use Illuminate\Container\Container;
use PHPUnit\Framework\TestCase;

/**
 * Start-up fails by name when a service every shell command depends on is unbound; nothing falls back to a parser or
 * runner that lets commands through (doc 21 revision 6, section 73 phase 6; stories 1, 145, 193 and 194).
 */
final class RequiredServicesTest extends TestCase
{
    public function test_an_unbound_parser_stops_start_up_by_name(): void
    {
        $this->expectException(ProcessesServiceMissing::class);
        $this->expectExceptionMessage(ShellCommandParser::class);

        RequiredServices::check(new Container());
    }
}
