<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\CallScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * No test fakes every event: a bare Event::fake() fakes Eloquent's saved and deleted too, so the event unit would
 * capture nothing; a test names its business events through TestCase::fakeBusinessEvents or Event::fake([...]).
 */
#[TimeLimit(seconds: 15, reason: 'It parses every test file.')]
final class BareEventFakeTest extends TestCase
{
    public function test_no_test_fakes_every_event(): void
    {
        $folders = [base_path('tests'), ...glob(base_path('domain/*/tests'), GLOB_ONLYDIR) ?: []];
        $bare = [];

        foreach (ScanCache::findingsInFolders(new CallScan(), $folders) as $path => $calls) {
            $lines = file($path) ?: [];

            foreach ($calls as $call) {
                $isEventFake = $call['method'] === 'fake' && $call['class'] === 'Illuminate\Support\Facades\Event';
                $line = $lines[$call['line'] - 1] ?? '';

                if ($isEventFake && preg_match('/::fake\(\s*\)/', $line) === 1) {
                    $bare[] = substr($path, strlen(base_path()) + 1).":{$call['line']}";
                }
            }
        }

        $this->assertSame([], array_values(array_unique($bare)), 'Name the faked events with fakeBusinessEvents(...):');
    }
}
