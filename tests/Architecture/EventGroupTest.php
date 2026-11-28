<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Bootstrap\CoreListenerFolders;
use App\Bus\ListenerOwnership;
use App\Contracts\Events\Event;
use App\Reflection\CatalogueReflectorFactory;
use App\Support\DomainRegistry;
use App\Support\ProjectCode;
use App\Support\Reflector;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\EventGroups;
use Tests\Fixtures\EventGroups\Billing\Events\InvoiceSent;
use Tests\Fixtures\EventGroups\Contracts\LonelyGroup;
use Tests\Fixtures\EventGroups\Empty\Events\ItemHappened;
use Tests\Fixtures\EventGroups\Orders\Events\OrderBilled;
use Tests\Fixtures\EventGroups\Orders\Events\OrderEvent;
use Tests\Fixtures\EventGroups\Orders\Events\OrderLinePosted;
use Tests\Fixtures\EventGroups\Orders\Events\OrderShipped;
use Tests\Fixtures\EventGroups\Orders\Listeners\RecordShipment;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every event extends the one base event of its domain, or of its subject in Core, and smaller groups are interfaces
 * events join, so a listener typed on a base or a group receives every event of it and no list of events is kept.
 */
#[TimeLimit(seconds: 20, reason: 'It reads every event and contract folder of the project.')]
final class EventGroupTest extends TestCase
{
    public function test_the_events_of_the_project_form_their_groups(): void
    {
        $ownership = new ListenerOwnership(
            $this->app->make(DomainRegistry::class),
            CoreListenerFolders::all(),
            new CatalogueReflectorFactory(),
            app_path(),
        );
        $domainFolders = array_values(array_filter(
            array_map(fn (string $code) => "{$code}/Events", DomainFiles::domainCode()),
            is_dir(...),
        ));
        $groups = new EventGroups($ownership->eventClasses(), $domainFolders, self::groupsIn([app_path(), ...DomainFiles::domainCode()]));

        $this->assertSame([], $groups->baseFaults());
        $this->assertSame([], $groups->domainBaseFaults());
        $this->assertSame([], $groups->emptyGroupFaults());
        $this->assertSame([], $groups->stemFaults());
        $this->assertSame([], $groups->sharedPropertyFaults());
        $this->assertSame([], EventGroups::wiringFaults(self::wiring()));
    }

    public function test_each_fault_of_a_group_is_pointed_out(): void
    {
        $root = base_path('tests/Fixtures/EventGroups');
        $folders = ["{$root}/Orders/Events", "{$root}/Billing/Events", "{$root}/Empty/Events"];
        $events = array_merge(...array_map(fn (string $folder) => ProjectCode::in($folder, Event::class), $folders));
        $groups = new EventGroups($events, $folders, self::groupsIn([$root]));

        $this->assertSame(
            [OrderBilled::class, OrderShipped::class, ItemHappened::class],
            self::named($groups->baseFaults(), $events),
        );
        $this->assertCount(2, $groups->domainBaseFaults());
        $this->assertSame([LonelyGroup::class], self::named($groups->emptyGroupFaults(), [LonelyGroup::class]));
        $this->assertSame([OrderLinePosted::class], self::named($groups->stemFaults(), [OrderLinePosted::class]));
        $this->assertSame(
            [OrderEvent::class.': every event of it has $orderId (string), so the group declares it'],
            $groups->sharedPropertyFaults(),
        );
        $this->assertSame(
            [InvoiceSent::class],
            self::named(EventGroups::wiringFaults([InvoiceSent::class => [RecordShipment::class.'@handle']]), [InvoiceSent::class]),
        );
    }

    /**
     * The classes among those given that a fault names, in the order given.
     *
     * @param  list<string>  $faults
     * @param  list<string>  $classes
     * @return list<string>
     */
    private static function named(array $faults, array $classes): array
    {
        return array_values(array_filter(
            $classes,
            fn (string $class) => array_any($faults, fn (string $fault) => preg_match(self::wholeName($class), $fault) === 1),
        ));
    }

    /**
     * A pattern that finds the class name as a whole name, not as the start of a longer one.
     */
    private static function wholeName(string $class): string
    {
        return '/'.preg_quote($class, '/').'(?![\\w\\\\])/';
    }

    /**
     * Every interface in a Contracts folder under the roots that extends Event.
     *
     * @param  list<string>  $roots
     * @return list<class-string>
     */
    private static function groupsIn(array $roots): array
    {
        $groups = [];

        foreach (DomainFiles::in($roots) as $file) {
            $source = (string) file_get_contents($file);
            $isContract = str_contains($file, '/Contracts/');

            if (! $isContract
                || preg_match('/^namespace ([^;]+);/m', $source, $namespace) !== 1
                || preg_match('/^interface (\w+)/m', $source, $name) !== 1) {
                continue;
            }

            $interface = "{$namespace[1]}\\{$name[1]}";

            if (Reflector::exists($interface) && Reflector::of($interface)->isSubclassOf(Event::class)) {
                $groups[] = $interface;
            }
        }

        return $groups;
    }

    /**
     * Each event with the listeners the app wires to it, written as Class@method, of the listener classes only.
     *
     * @return array<string, list<string>>
     */
    private static function wiring(): array
    {
        $wiring = [];

        foreach (app(Dispatcher::class)->getRawListeners() as $event => $listeners) {
            preg_match_all('/([A-Za-z\\\\]+\\\\Listeners\\\\\w+)@(\w+)/', stripslashes((string) json_encode($listeners)), $found);
            $wiring[$event] = array_values(array_unique($found[0]));
        }

        return array_filter($wiring);
    }
}
