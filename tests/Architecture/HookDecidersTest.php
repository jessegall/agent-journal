<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Hooks\Contracts\HookDecider;
use App\Support\Reflector;
use Tests\Architecture\Support\HookAnswerScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Only a HookDecider makes a hook answer: every state is one, and so is each step of the answer that gates or
 * replaces what the states answered. Any other class that builds a decision, a message or context line or a hook
 * answer is refused, read from the syntax tree; changing an answer takes the decider itself (HookAnswer::replacedBy).
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app and the domains.')]
final class HookDecidersTest extends TestCase
{
    public function test_only_a_hook_decider_makes_a_hook_answer(): void
    {
        $folders = [base_path('app'), ...glob(base_path('domain/*/src'), GLOB_ONLYDIR) ?: []];

        $this->assertSame([], $this->undeclaredIn($folders));
    }

    public function test_a_class_that_makes_an_answer_without_being_a_decider_is_named(): void
    {
        $this->assertSame(
            [
                'tests/Fixtures/HookDeciders/UndeclaredDecider.php:17 '
                .'Tests\Fixtures\HookDeciders\UndeclaredDecider builds Decision::deny',
            ],
            $this->undeclaredIn([base_path('tests/Fixtures/HookDeciders')]),
        );
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function undeclaredIn(array $folders): array
    {
        $faults = [];

        foreach (ScanCache::findingsInFolders(new HookAnswerScan(), $folders) as $path => $found) {
            foreach ($found as $finding) {
                [$line, $class, $what] = explode(' ', $finding, 3);

                if (! Reflector::exists($class) || ! Reflector::of($class)->is(HookDecider::class)) {
                    $faults[] = substr($path, strlen(base_path()) + 1).":{$line} {$class} {$what}";
                }
            }
        }

        sort($faults);

        return $faults;
    }
}
