<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Event;
use Tests\Architecture\Support\DomainFiles;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every class in an Events folder of Core, a domain or an installed module implements Core's Event marker, so what
 * happens is recognisable as an event (user message 2307).
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class EventMarkerTest extends TestCase
{
    public function test_every_event_implements_the_event_marker(): void
    {
        $unmarked = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode(), base_path('tests/Fixtures/Modules')]) as $file) {
            if (! str_contains($file, '/Events/')) {
                continue;
            }

            $class = self::classIn($file);

            if ($class !== null && ! is_subclass_of($class, Event::class) && ! interface_exists($class)) {
                $unmarked[] = $class;
            }
        }

        $this->assertSame([], $unmarked);
    }

    private static function classIn(string $file): string|null
    {
        $source = (string) file_get_contents($file);

        if (preg_match('/^namespace ([^;]+);/m', $source, $namespace) !== 1 || preg_match('/^(?:final |abstract )?(?:readonly )?(?:class|interface|enum) (\w+)/m', $source, $name) !== 1) {
            return null;
        }

        return $namespace[1].'\\'.$name[1];
    }
}
