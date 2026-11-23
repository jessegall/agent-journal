<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\CoreApi;
use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use App\Support\ListenerOwnership;
use App\Support\Reflector;
use Tests\Architecture\Support\DomainFiles;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A listener typed on one of the expanded interfaces, such as the one that tells the open pages, is attached only to
 * the events their owner exports. So every event that implements such an interface is exported: one that is not
 * reaches no page, as the chat's facts did not (user messages 19571 and 19640).
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class PageFactListenerTest extends TestCase
{
    public function test_every_event_that_updates_a_page_is_exported_so_its_listeners_hear_it(): void
    {
        $exported = [
            ...CoreApi::exports()->events,
            ...array_merge([], ...array_map(
                fn (DomainEntry $entry) => $entry->exports->events,
                $this->app->make(DomainRegistry::class)->all(),
            )),
        ];
        $unheard = [];

        foreach (DomainFiles::in([app_path('Events'), ...DomainFiles::domainCode()]) as $file) {
            $class = self::eventIn($file);

            if ($class !== null && self::updatesAPage($class) && ! in_array($class, $exported, true)) {
                $unheard[] = $class;
            }
        }

        $this->assertSame([], $unheard);
    }

    private static function updatesAPage(string $class): bool
    {
        foreach (ListenerOwnership::EXPANDED_INTERFACES as $interface) {
            if (Reflector::factory()->isSubclassOf($class, $interface)) {
                return true;
            }
        }

        return false;
    }

    private static function eventIn(string $file): string|null
    {
        $source = (string) file_get_contents($file);
        $isEvent = preg_match('#/Events/\w+\.php$#', $file) === 1;

        if (! $isEvent || preg_match('/^namespace ([^;]+);/m', $source, $namespace) !== 1 || preg_match(
            '/^(?:final )?(?:readonly )?class (\w+)/m',
            $source,
            $name,
        ) !== 1) {
            return null;
        }

        return $namespace[1].'\\'.$name[1];
    }
}
