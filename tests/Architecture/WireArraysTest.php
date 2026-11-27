<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\WireArrayScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A Data goes over the wire as it is: a JSON response and an MCP tool result turn it into an array themselves, so no
 * code calls toArray() to hand it to them (user 27775, 27777).
 */
#[TimeLimit(seconds: 20, reason: 'It parses every PHP file of the app and the domains.')]
final class WireArraysTest extends TestCase
{
    private const string HOW_TO_FIX = "Hand the Data itself; the response or the tool result turns it into an array:\n";

    public function test_no_data_is_turned_into_an_array_by_hand_for_the_wire(): void
    {
        $found = [];

        foreach (ScanCache::findingsInFolders(new WireArrayScan(), [app_path(), ...DomainFiles::domainCode()]) as $path => $calls) {
            foreach ($calls as $call) {
                $found[] = substr($path, strlen(base_path()) + 1).":{$call['line']} {$call['sink']}";
            }
        }

        $this->assertSame([], $found, self::HOW_TO_FIX.implode("\n", $found));
    }

    public function test_a_hand_made_array_for_the_wire_is_caught(): void
    {
        $fixture = base_path('tests/Fixtures/Architecture/WireArrays/HandsArraysToTheWire.php');

        $sinks = array_column(ScanCache::findings(new WireArrayScan(), [$fixture]), 'sink');

        $this->assertSame(['new JsonResponse', 'ToolResult::ok'], $sinks);
    }
}
