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
 * runner that lets commands through.
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
